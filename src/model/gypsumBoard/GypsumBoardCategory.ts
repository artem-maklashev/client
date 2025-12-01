class GypsumBoardCategory {
    static fromJSON(gypsumBoardCategory: any) {
        return new GypsumBoardCategory(gypsumBoardCategory.id, gypsumBoardCategory.title);
    }
    id: number;
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }
}

export default GypsumBoardCategory;