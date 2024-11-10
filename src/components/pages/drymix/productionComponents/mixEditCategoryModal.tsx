import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";

interface MixEditCategoryModalProps { 
    show: boolean;
    category: MixCategoryProduction | null;
    handleSave: (category: MixCategoryProduction) => void;

}


const MixEditCategoryModal: React.FC<MixEditCategoryModalProps> = ({ show, category, handleSave }) => {


    return null;
}
export default MixEditCategoryModal;