// import {ObjectId, WithId} from "mongodb";
// import {OutputPostType, PostType} from "../post/output";
// import {postLikesCollection, usersCollection} from "../../db";
// postMapper.ts
// export const postMapper = async (post: any, userId?: string) => {
//     // Логируем id поста и его тип
//     console.log('post.id:', post.id, 'typeof:', typeof post.id);
//
//     // Логируем все лайки для этого поста
//     const allLikes = await postLikesCollection.find({}).toArray();
//     console.log('Все лайки в коллекции:', allLikes);
//     const postId = post.id || post._id?.toString();
//     // Считаем лайки/дизлайки (убедись, что post.id — строка!)
//     const likesCount = await postLikesCollection.countDocuments({ postId: postId, likeStatus: "Like" });
//     const dislikesCount = await postLikesCollection.countDocuments({ postId: postId, likeStatus: "Dislike" });
//
//     // Логируем результат подсчёта
//     console.log('likesCount:', likesCount, 'dislikesCount:', dislikesCount);
//
//     // Статус текущего пользователя
//     let myStatus = "None";
//     console.log('лох userId:', userId, 'лох postId:', postId);
//
//     if (userId) {
//         console.log('лох userId:', userId, 'лох postId:', postId);
//         const myLike = await postLikesCollection.findOne({ postId, userId: userId.toString() });
//         console.log('myLike:', myLike);
//         if (myLike) myStatus = myLike.likeStatus;
//     }
//
//     // Три последних лайкнувших
//     const newestLikesRaw = await postLikesCollection
//         .find({ postId: postId, likeStatus: "Like" })
//         .sort({ addedAt: -1 })
//         .limit(3)
//         .toArray();
//
//     console.log('newestLikesRaw:', newestLikesRaw);
//
//     // Получаем логины пользователей
//     const allUsers = await usersCollection.find({}).toArray();
//     console.log('Все пользователи:', allUsers);
//
//     const newestLikes = await Promise.all(
//         newestLikesRaw.map(async (like) => {
//             let user = null;
//             try {
//                 user = await usersCollection.findOne({ _id: new ObjectId(like.userId) });
//             } catch (e) {
//                 console.log('Ошибка при поиске пользователя по userId:', like.userId, e);
//             }
//             return {
//                 addedAt: like.addedAt,
//                 userId: like.userId,
//                 login: user?.accountData?.login || "unknown"
//             };
//         })
//     );
//
//     return {
//         id: post.id || post._id?.toString(),
//         title: post.title,
//         shortDescription: post.shortDescription,
//         content: post.content,
//         blogId: post.blogId,
//         blogName: post.blogName,
//         createdAt: post.createdAt,
//         extendedLikesInfo: {
//             likesCount,
//             dislikesCount,
//             myStatus,
//             newestLikes
//         }
//     };
// };
