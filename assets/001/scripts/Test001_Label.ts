
import { _decorator, Component, Node, Label } from 'cc';
import { unwatchProperty, watchProperty } from './core/Watch';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('Test001_Label')
@requireComponent(Label)
export class Test001_Label extends Component {

    @property({ type: Component })
    protected target: Component = null;

    @property({})
    protected propertyKey: string = '';

    @property({ visible: false })
    protected label: Label = null;

    protected onLoad() {
        this.init();
        this.register();
    }

    protected onDestroy() {
        this.unregister();
    }

    protected init() {
        this.label = this.getComponent(Label);
    }

    protected register() {
        console.log('[Test001_Label]', 'register', '|', 'target:', this.target, 'propertyKey:', this.propertyKey);
        watchProperty(this.target, this.propertyKey, this.onDataChanged, this);
    }

    protected unregister() {
        unwatchProperty(this.target, this.propertyKey, this.onDataChanged, this);
    }

    protected onDataChanged(newValue: number, oldValue: number) {
        console.log('[Test001_Label]', 'onDataChanged', '|', 'newValue:', newValue, 'oldValue:', oldValue);
        this.label.string = newValue.toString();
    }

}
