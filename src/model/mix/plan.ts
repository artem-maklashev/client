import DryMix from "./DryMix";

class Plan {
    id: number;
    mix: DryMix;
    value: number;

    constructor(id: number, mix: DryMix, value: number) {
       this.id = id;
       this.mix = mix;
       this.value = value;
   }

}
export default Plan;