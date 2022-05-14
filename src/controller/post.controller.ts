import { throws } from "assert";
import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  createPost,
  findPost,
  findAndUpdate,
  deletePost,
} from "../service/post/post.controller";

export const createPostHandler = async (req: Request, res: Response) => {

    try{
        const userId = get(req, "user._id");
        const body = req.body;

        const post = await createPost({ ...body, user: userId });

        return res.send(post);

    } catch (err) {
        //log error with logger which doesn't block i/o like console.log does
        log.error(err);
        return res.status(500).json({ 
            status:500,
            message: "Ops something went wrong. Please try again later!!"
        })
    }
 
}

export const updatePostHandler = async(req: Request, res: Response) => {

    try{
            const userId = get(req, "user._id");
            const postId = get(req, "params.postId");
            const update = req.body;

            const post = await findPost({ postId });

            if (!post) {
                return res.sendStatus(404);
            }

            if (String(post.user) !== userId) {
                return res.sendStatus(401);
            }

            const updatedPost = await findAndUpdate({ postId }, update, { new: true });

            return res.send(updatedPost);

    } catch(err){
        //log error with logger which doesn't block i/o like console.log does
        log.error(err);
        return res.status(500).json({ 
            status:500,
            message: "Ops something went wrong. Please try again later!!"
        })
    }
}


export const getPostHandler = async (req: Request, res: Response) => {
 
    try {
        const postId = get(req, "params.postId");
        const post = await findPost({ postId });

        if (!post) {
            return res.sendStatus(404);
        }

        return res.send(post);
 } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({ 
        status:500,
        message: "Ops something went wrong. Please try again later!!"
    })
 }
}


export const deletePostHandler = async(req: Request, res: Response) => {
  
    try {
            const userId = get(req, "user._id");
            const postId = get(req, "params.postId");

            const post = await findPost({ postId });

            if (!post) {
                return res.sendStatus(404);
            }

            if (String(post.user) !== String(userId)) {
                return res.sendStatus(401);
            }

            await deletePost({ postId });

            return res.sendStatus(200);


    } catch (err) {
        //log error with logger which doesn't block i/o like console.log does
        log.error(err);
        return res.status(500).json({ 
            status:500,
            message: "Ops something went wrong. Please try again later!!"
        })
        
    }
}
