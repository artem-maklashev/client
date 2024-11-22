import { Button, Container, Table } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import React, { useEffect, useState } from "react";
import { TiEdit } from "react-icons/ti";
import MixApiService from "../../../../service/MixApiService";
import MixCategory from "../../../../model/mix/prodution/MixCategory";
import MixProduction from "../../../../model/mix/prodution/MixProduction";


interface MixCategoryTableProps {
    categories: MixCategoryProduction[];
    handleEditCategory: (category: MixCategoryProduction) => void;
}

const MixCategoriesTable: React.FC<MixCategoryTableProps> = ({
    categories,
    handleEditCategory,
}) => {   

    const [allCategories, setAllCategories] = useState<MixCategory[]>([]);
    const [tableData, setTableData] = useState<MixCategoryProduction[]>([]);
   

    useEffect(() => {
        const fetchCategories = async () => {
            const data: MixCategory[] = await MixApiService.getAllCategories();
            setAllCategories(data);
    
            const categoriesAndProduction: MixCategoryProduction[] = data.map(cat => {
                const existingCategory = categories.find(category => category.category.id === cat.id);
                if (existingCategory) {
                    return existingCategory;
                } else {
                    if (categories.length > 0) {
                        const categoryProduction = categories[0];
                        return new MixCategoryProduction(-1, categoryProduction.production, cat, 0);
                    } else {
                        return new MixCategoryProduction(-1, new MixProduction(), cat, 0);
                    }
                }
            });
            
            setTableData(categoriesAndProduction);
        };
    
        if (allCategories.length === 0) {
            fetchCategories();
        }
    }, [allCategories.length, categories]);
    
    

    return (
        <Container fluid className="mt-3">
            <Table striped bordered hover size="sm" variant="dark" >
                <thead>
                    <tr>
                        <th>Вид производства</th>
                        <th>Значение</th>
                        {/* <th>Действия</th> */}
                    </tr>
                </thead>
                <tbody>
                    {tableData.length > 0 ? (
                        tableData.map((entry) => (
                            <tr key={entry.category.id}>
                                <td>{entry.category.title}</td>
                                <td>
                                    <Button
                                        variant="success"
                                        style={{ right: 0, borderRadius: '25px'}}
                                        onClick={() => handleEditCategory(entry)}
                                        disabled={entry.category.id === 6}
                                    
                                    >
                                        <TiEdit />
                                    </Button>{" "}
                                    {entry.quantity}{" "}                                    
                                </td>                                
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>Нет данных для отображения</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};
export default MixCategoriesTable;