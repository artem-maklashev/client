import DryMix from "./DryMix";

class MixPlan {
    id: number;
    mix: DryMix;
    planDate: Date;
    value: number;

    constructor(id: number, planDate: Date, mix: DryMix, value: number) {
       this.id = id;
       this.mix = mix;
       this.value = value;
       this.planDate = planDate;
   }

}
export default MixPlan;