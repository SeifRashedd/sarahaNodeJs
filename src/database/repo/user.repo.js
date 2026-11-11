import { UserModel } from '../models/user_model.js'
import repo from './base.repo.js'


let queries = repo(UserModel)

export default queries