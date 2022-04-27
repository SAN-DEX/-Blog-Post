import dbConnect from "../../../libs/dbConnect";
import Post from "../../../models/post.model";

export default async function handler(req, res) {
  //(body, query, method)
  const { method, body, query } = req;
  await dbConnect();

  if (method === "GET") {
    const post = await Post.findById(query.postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post });
  } else if (method === "PATCH") {
    // CHECKING IF THE POST TO BE EDITED EXISTS
    let post = await Post.findById(query.postId);
    console.log(post);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }

    post = await Post.findByIdAndUpdate(query.postId, body, { new: true });
    res.status(200).json({ post });
  } else if (method === "DELETE") {
    // CHECKING IF THE POST TO BE EDITED EXISTS
    let post = await Post.findById(query.postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }

    //finding and deleting the post
    await Post.findByIdAndDelete(query.postId);
    res.status(200).json({ msg: "Post Deleted Successfully." });
  }
}
