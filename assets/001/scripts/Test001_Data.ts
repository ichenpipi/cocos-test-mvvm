
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test001_Data')
export class Test001_Data extends Component {

    /**
     * 计数
     */
    public count: number = 0;

    /**
     * 增加计数
     */
    public addCount() {
        console.log('[Test001_Data]', 'addCount', '|', 'count', this.count + 1);
        this.count++;
    }

}
