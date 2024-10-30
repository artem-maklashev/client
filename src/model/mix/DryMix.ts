import Product from "../Product";
import ProductTypes from "../ProductTypes";
import TradeMark from "../TradeMark";
import Binder from "./Binder";
import DryMixType from "./DryMixType";

class DryMix extends Product {
    binder: Binder;
    dryMixType: DryMixType;
    name: string;

    constructor (id: number, ptype: ProductTypes, tradeMark: TradeMark, binder: Binder, dryMixType: DryMixType, name: string ) {
        super(id, ptype, tradeMark);
        this.binder = binder;
        this.dryMixType = dryMixType;
        this.name = name;
    }
}
export default DryMix;