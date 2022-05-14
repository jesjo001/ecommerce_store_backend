import express from 'express';
import { postValidationRules, createPostValidationRules, validate } from '../../middleware/validation/validator'
import requiresUser from "../../middleware/validation/requiresUser"
import { getPostHandler, createPostHandler ,deletePostHandler, updatePostHandler } from "../../controller/post.controller"
const PostRouter = express.Router();

PostRouter.post('/create', createPostValidationRules(), validate, requiresUser, createPostHandler )
PostRouter.put('/:postId', postValidationRules(), validate, requiresUser, updatePostHandler)
PostRouter.delete('/:postId', requiresUser, deletePostHandler  )
PostRouter.get('/:postId', getPostHandler)

export default PostRouter;