import Product from "../Product";
import ProductTypes from "../ProductTypes";
import TradeMark from "../TradeMark";
import Binder from "./Binder";
import DryMixType from "./DryMixType";

class DryMix extends Product {
    binder: Binder;
    dryMixType: DryMixType;
    name: string;

    constructor(
        id: number = -1,
        ptype: ProductTypes = new ProductTypes(),
        tradeMark: TradeMark = new TradeMark(),
        binder: Binder = new Binder(),
        dryMixType: DryMixType = new DryMixType(),
        name: string = ""
    ) {
        super(id, ptype, tradeMark);
        this.binder = binder;
        this.dryMixType = dryMixType;
        this.name = name;
    }
}

export default DryMix;