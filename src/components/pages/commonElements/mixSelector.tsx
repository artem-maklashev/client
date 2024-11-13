import React, { useEffect, useState } from "react";
import DryMix from "../../../model/mix/DryMix";
import { Col, Form } from "react-bootstrap";
import MixApiService from "../../../service/MixApiService";

interface MixSelectorProps {
    mix: DryMix | null;
    handleMixChange: (mix: DryMix) => void;
}

const MixSelector: React.FC<MixSelectorProps> = ({ handleMixChange, mix }) => {
    const [selectedProduct, setSelectedProduct] = useState<DryMix | null>(null);
    const [mixList, setMixList] = useState<DryMix[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getName = (mix: DryMix) => {
        return `${mix.tradeMark.name} ${mix.dryMixType.name} ${mix.binder.name} ${mix.name}`;
    };

    useEffect(() => {
        const fetchMixes = async () => {
            try {
                const data = await MixApiService.MixList();
                setMixList(data);

                
            } catch (error) {
                console.error("Error fetching mix list:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMixes();
    }, []);

    useEffect(() => {
        if (mix) {
            setSelectedProduct(mix);
        }
    }, [mix]);

    useEffect(() => {
        if (!selectedProduct && mixList.length > 0) {
            setSelectedProduct(mixList[0]);
            handleMixChange(mixList[0]);
            console.log('Выбрана смесь:', mixList[0]);
        }
    }, [handleMixChange, mixList, selectedProduct])

    return (
        <Col className="col-lg-7 col-sm-8 bordered mt-2">
            <Form.Group>
                <Form.Label>Сухая смесь</Form.Label>
                <Form.Select
                    value={
                        selectedProduct
                            ? selectedProduct.id.toString()
                            : (mixList[0]?.id || "").toString()
                    }
                    onChange={(e) => {
                        const selectedProductId = parseInt(e.target.value);
                        const foundMix = mixList.find(
                            (mix) => mix.id === selectedProductId
                        );
                        setSelectedProduct(foundMix || null);
                        if (foundMix) {
                            handleMixChange(foundMix);
                        }
                    }}
                    disabled={isLoading} // Отключаем выбор, пока идет загрузка
                    size="sm"
                >
                    {isLoading ? (
                        <option>Загрузка...</option>
                    ) : (
                        mixList.map((mix) => (                            
                            <option key={mix.id} value={mix.id.toString()}>
                                {getName(mix)}
                            </option>                          
                        ))
                    )}
                </Form.Select>
            </Form.Group>
        </Col>
    );
};

export default MixSelector;
