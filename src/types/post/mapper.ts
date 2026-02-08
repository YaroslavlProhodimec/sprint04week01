import { ObjectId } from 'mongodb';
import { OutputPostType, PostType } from './output';
import { postLikesCollection, usersCollection } from '../../db';

export const postMapper = async (post: any, userId?: string) => {
  const postId = post.id ?? post._id?.toString();

  const likesCount = await postLikesCollection
    .countDocuments({ postId, likeStatus: 'Like' });
  const dislikesCount = await postLikesCollection
    .countDocuments({ postId, likeStatus: 'Dislike' });

  let myStatus: 'Like' | 'Dislike' | 'None' = 'None';
  if (userId) {
    const myLike = await postLikesCollection.findOne({
      postId,
      userId: userId.toString(),
    });
    if (myLike && typeof myLike === 'object' && 'likeStatus' in myLike) {
      myStatus = myLike.likeStatus as 'Like' | 'Dislike' | 'None';
    }
  }

  const newestLikesRaw = await postLikesCollection
    .find({ postId, likeStatus: 'Like' })
    .sort({ addedAt: -1 })
    .limit(3)
    .toArray();

  const newestLikes = await Promise.all(
    (Array.isArray(newestLikesRaw) ? newestLikesRaw : []).map(async (like: any) => {
      let user: any = null;
      try {
        user = await usersCollection.findOne({
          _id: new ObjectId(like.userId),
        });
      } catch {
        // userId может быть невалидным ObjectId
      }
      return {
        addedAt: like.addedAt,
        userId: like.userId,
        login: user?.accountData?.login ?? 'unknown',
      };
    }),
  );

  const rawCreatedAt = post.createdAt;
  const createdAt =
    rawCreatedAt instanceof Date
      ? rawCreatedAt.toISOString()
      : typeof rawCreatedAt === 'string'
        ? rawCreatedAt
        : String(rawCreatedAt ?? '');

  return {
    id: postId ?? '',
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt,
    extendedLikesInfo: {
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes,
    },
  };
};
