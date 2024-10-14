import Product from "../Product";
import ProductTypes from "../ProductTypes";
import TradeMark from "../TradeMark";
import Binder from "./Binder";
import DryMixType from "./DryMixType";

class DryMix extends Product {
    binder: Binder;
    dryMixType: DryMixType;

    constructor (id: number, ptype: ProductTypes, tradeMark: TradeMark, binder: Binder, dryMixType: DryMixType ) {
        super(id, ptype, tradeMark);
        this.binder = binder;
        this.dryMixType = dryMixType;
    }
}
export default DryMix;