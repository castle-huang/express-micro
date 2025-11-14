import {UserService} from "../UserService";
import {Service} from "@sojo-micro/rpc";

@Service()
export default class UserServiceImpl implements UserService {
    async hello() {
        return "hello world";
    }
}