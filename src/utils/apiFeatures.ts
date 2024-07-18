import { Document, Query } from 'mongoose';

interface QueryString {
    keyword?: string;
    limit?: number;
    page?: number;
    date?: string; 
    [key: string]: any;
}

class APIFeatures {
    query: Query<Document[], Document>;
    querystr: QueryString;

    constructor(query: Query<Document[], Document>, querystr: QueryString) {
        this.query = query;
        this.querystr = querystr;
    }

    search() {
        let keyword: any = this.querystr.keyword
            ? {
                  name: {
                      $regex: this.querystr.keyword,
                      $options: 'i',
                  },
              }
            : {};

        this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryStrCopy: QueryString = { ...this.querystr };

        const removeFields: string[] = ['keyword', 'limit', 'page'];
        removeFields.forEach((field) => delete queryStrCopy[field]);

        let querystr: string = JSON.stringify(queryStrCopy);
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        this.query.find(JSON.parse(querystr));
        return this;
    }


    filterByDate() {
        if (this.querystr.date) {
            const parts = this.querystr.date.split('-');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are zero-indexed in JavaScript Date object
            const year = parseInt(parts[2], 10);
            const startDate = new Date(year, month, day);
            const endDate = new Date(year, month, day + 1); // End date is exclusive

            this.query.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
            });
        }
        return this;
    }

    paginate(resperpage: number) {
        const currentPage: number = Number(this.querystr.page) || 1;
        const skip: number = resperpage * (currentPage - 1);

        this.query.limit(resperpage).skip(skip);
        return this;
    }
}

export default APIFeatures;
