import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Basemodel
 *
 */
export type BasemodelModel = runtime.Types.Result.DefaultSelection<Prisma.$BasemodelPayload>;
export type AggregateBasemodel = {
    _count: BasemodelCountAggregateOutputType | null;
    _avg: BasemodelAvgAggregateOutputType | null;
    _sum: BasemodelSumAggregateOutputType | null;
    _min: BasemodelMinAggregateOutputType | null;
    _max: BasemodelMaxAggregateOutputType | null;
};
export type BasemodelAvgAggregateOutputType = {
    id: number | null;
};
export type BasemodelSumAggregateOutputType = {
    id: number | null;
};
export type BasemodelMinAggregateOutputType = {
    id: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BasemodelMaxAggregateOutputType = {
    id: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BasemodelCountAggregateOutputType = {
    id: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BasemodelAvgAggregateInputType = {
    id?: true;
};
export type BasemodelSumAggregateInputType = {
    id?: true;
};
export type BasemodelMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BasemodelMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BasemodelCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BasemodelAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Basemodel to aggregate.
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Basemodels to fetch.
     */
    orderBy?: Prisma.BasemodelOrderByWithRelationInput | Prisma.BasemodelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.BasemodelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Basemodels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Basemodels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Basemodels
    **/
    _count?: true | BasemodelCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: BasemodelAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: BasemodelSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BasemodelMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BasemodelMaxAggregateInputType;
};
export type GetBasemodelAggregateType<T extends BasemodelAggregateArgs> = {
    [P in keyof T & keyof AggregateBasemodel]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBasemodel[P]> : Prisma.GetScalarType<T[P], AggregateBasemodel[P]>;
};
export type BasemodelGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BasemodelWhereInput;
    orderBy?: Prisma.BasemodelOrderByWithAggregationInput | Prisma.BasemodelOrderByWithAggregationInput[];
    by: Prisma.BasemodelScalarFieldEnum[] | Prisma.BasemodelScalarFieldEnum;
    having?: Prisma.BasemodelScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BasemodelCountAggregateInputType | true;
    _avg?: BasemodelAvgAggregateInputType;
    _sum?: BasemodelSumAggregateInputType;
    _min?: BasemodelMinAggregateInputType;
    _max?: BasemodelMaxAggregateInputType;
};
export type BasemodelGroupByOutputType = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    _count: BasemodelCountAggregateOutputType | null;
    _avg: BasemodelAvgAggregateOutputType | null;
    _sum: BasemodelSumAggregateOutputType | null;
    _min: BasemodelMinAggregateOutputType | null;
    _max: BasemodelMaxAggregateOutputType | null;
};
type GetBasemodelGroupByPayload<T extends BasemodelGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BasemodelGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BasemodelGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BasemodelGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BasemodelGroupByOutputType[P]>;
}>>;
export type BasemodelWhereInput = {
    AND?: Prisma.BasemodelWhereInput | Prisma.BasemodelWhereInput[];
    OR?: Prisma.BasemodelWhereInput[];
    NOT?: Prisma.BasemodelWhereInput | Prisma.BasemodelWhereInput[];
    id?: Prisma.IntFilter<"Basemodel"> | number;
    createdAt?: Prisma.DateTimeFilter<"Basemodel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Basemodel"> | Date | string;
};
export type BasemodelOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BasemodelWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.BasemodelWhereInput | Prisma.BasemodelWhereInput[];
    OR?: Prisma.BasemodelWhereInput[];
    NOT?: Prisma.BasemodelWhereInput | Prisma.BasemodelWhereInput[];
    createdAt?: Prisma.DateTimeFilter<"Basemodel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Basemodel"> | Date | string;
}, "id">;
export type BasemodelOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BasemodelCountOrderByAggregateInput;
    _avg?: Prisma.BasemodelAvgOrderByAggregateInput;
    _max?: Prisma.BasemodelMaxOrderByAggregateInput;
    _min?: Prisma.BasemodelMinOrderByAggregateInput;
    _sum?: Prisma.BasemodelSumOrderByAggregateInput;
};
export type BasemodelScalarWhereWithAggregatesInput = {
    AND?: Prisma.BasemodelScalarWhereWithAggregatesInput | Prisma.BasemodelScalarWhereWithAggregatesInput[];
    OR?: Prisma.BasemodelScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BasemodelScalarWhereWithAggregatesInput | Prisma.BasemodelScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Basemodel"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Basemodel"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Basemodel"> | Date | string;
};
export type BasemodelCreateInput = {
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BasemodelUncheckedCreateInput = {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BasemodelUpdateInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BasemodelUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BasemodelCreateManyInput = {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BasemodelUpdateManyMutationInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BasemodelUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BasemodelCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BasemodelAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type BasemodelMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BasemodelMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BasemodelSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BasemodelSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["basemodel"]>;
export type BasemodelSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["basemodel"]>;
export type BasemodelSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["basemodel"]>;
export type BasemodelSelectScalar = {
    id?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BasemodelOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "createdAt" | "updatedAt", ExtArgs["result"]["basemodel"]>;
export type $BasemodelPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Basemodel";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["basemodel"]>;
    composites: {};
};
export type BasemodelGetPayload<S extends boolean | null | undefined | BasemodelDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BasemodelPayload, S>;
export type BasemodelCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BasemodelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BasemodelCountAggregateInputType | true;
};
export interface BasemodelDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Basemodel'];
        meta: {
            name: 'Basemodel';
        };
    };
    /**
     * Find zero or one Basemodel that matches the filter.
     * @param {BasemodelFindUniqueArgs} args - Arguments to find a Basemodel
     * @example
     * // Get one Basemodel
     * const basemodel = await prisma.basemodel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BasemodelFindUniqueArgs>(args: Prisma.SelectSubset<T, BasemodelFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Basemodel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BasemodelFindUniqueOrThrowArgs} args - Arguments to find a Basemodel
     * @example
     * // Get one Basemodel
     * const basemodel = await prisma.basemodel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BasemodelFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BasemodelFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Basemodel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelFindFirstArgs} args - Arguments to find a Basemodel
     * @example
     * // Get one Basemodel
     * const basemodel = await prisma.basemodel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BasemodelFindFirstArgs>(args?: Prisma.SelectSubset<T, BasemodelFindFirstArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Basemodel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelFindFirstOrThrowArgs} args - Arguments to find a Basemodel
     * @example
     * // Get one Basemodel
     * const basemodel = await prisma.basemodel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BasemodelFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BasemodelFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Basemodels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Basemodels
     * const basemodels = await prisma.basemodel.findMany()
     *
     * // Get first 10 Basemodels
     * const basemodels = await prisma.basemodel.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const basemodelWithIdOnly = await prisma.basemodel.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BasemodelFindManyArgs>(args?: Prisma.SelectSubset<T, BasemodelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Basemodel.
     * @param {BasemodelCreateArgs} args - Arguments to create a Basemodel.
     * @example
     * // Create one Basemodel
     * const Basemodel = await prisma.basemodel.create({
     *   data: {
     *     // ... data to create a Basemodel
     *   }
     * })
     *
     */
    create<T extends BasemodelCreateArgs>(args: Prisma.SelectSubset<T, BasemodelCreateArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Basemodels.
     * @param {BasemodelCreateManyArgs} args - Arguments to create many Basemodels.
     * @example
     * // Create many Basemodels
     * const basemodel = await prisma.basemodel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BasemodelCreateManyArgs>(args?: Prisma.SelectSubset<T, BasemodelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Basemodels and returns the data saved in the database.
     * @param {BasemodelCreateManyAndReturnArgs} args - Arguments to create many Basemodels.
     * @example
     * // Create many Basemodels
     * const basemodel = await prisma.basemodel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Basemodels and only return the `id`
     * const basemodelWithIdOnly = await prisma.basemodel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BasemodelCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BasemodelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Basemodel.
     * @param {BasemodelDeleteArgs} args - Arguments to delete one Basemodel.
     * @example
     * // Delete one Basemodel
     * const Basemodel = await prisma.basemodel.delete({
     *   where: {
     *     // ... filter to delete one Basemodel
     *   }
     * })
     *
     */
    delete<T extends BasemodelDeleteArgs>(args: Prisma.SelectSubset<T, BasemodelDeleteArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Basemodel.
     * @param {BasemodelUpdateArgs} args - Arguments to update one Basemodel.
     * @example
     * // Update one Basemodel
     * const basemodel = await prisma.basemodel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BasemodelUpdateArgs>(args: Prisma.SelectSubset<T, BasemodelUpdateArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Basemodels.
     * @param {BasemodelDeleteManyArgs} args - Arguments to filter Basemodels to delete.
     * @example
     * // Delete a few Basemodels
     * const { count } = await prisma.basemodel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BasemodelDeleteManyArgs>(args?: Prisma.SelectSubset<T, BasemodelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Basemodels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Basemodels
     * const basemodel = await prisma.basemodel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BasemodelUpdateManyArgs>(args: Prisma.SelectSubset<T, BasemodelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Basemodels and returns the data updated in the database.
     * @param {BasemodelUpdateManyAndReturnArgs} args - Arguments to update many Basemodels.
     * @example
     * // Update many Basemodels
     * const basemodel = await prisma.basemodel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Basemodels and only return the `id`
     * const basemodelWithIdOnly = await prisma.basemodel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BasemodelUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BasemodelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Basemodel.
     * @param {BasemodelUpsertArgs} args - Arguments to update or create a Basemodel.
     * @example
     * // Update or create a Basemodel
     * const basemodel = await prisma.basemodel.upsert({
     *   create: {
     *     // ... data to create a Basemodel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Basemodel we want to update
     *   }
     * })
     */
    upsert<T extends BasemodelUpsertArgs>(args: Prisma.SelectSubset<T, BasemodelUpsertArgs<ExtArgs>>): Prisma.Prisma__BasemodelClient<runtime.Types.Result.GetResult<Prisma.$BasemodelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Basemodels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelCountArgs} args - Arguments to filter Basemodels to count.
     * @example
     * // Count the number of Basemodels
     * const count = await prisma.basemodel.count({
     *   where: {
     *     // ... the filter for the Basemodels we want to count
     *   }
     * })
    **/
    count<T extends BasemodelCountArgs>(args?: Prisma.Subset<T, BasemodelCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BasemodelCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Basemodel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BasemodelAggregateArgs>(args: Prisma.Subset<T, BasemodelAggregateArgs>): Prisma.PrismaPromise<GetBasemodelAggregateType<T>>;
    /**
     * Group by Basemodel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasemodelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends BasemodelGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BasemodelGroupByArgs['orderBy'];
    } : {
        orderBy?: BasemodelGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BasemodelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBasemodelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Basemodel model
     */
    readonly fields: BasemodelFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Basemodel.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__BasemodelClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Basemodel model
 */
export interface BasemodelFieldRefs {
    readonly id: Prisma.FieldRef<"Basemodel", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Basemodel", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Basemodel", 'DateTime'>;
}
/**
 * Basemodel findUnique
 */
export type BasemodelFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * Filter, which Basemodel to fetch.
     */
    where: Prisma.BasemodelWhereUniqueInput;
};
/**
 * Basemodel findUniqueOrThrow
 */
export type BasemodelFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * Filter, which Basemodel to fetch.
     */
    where: Prisma.BasemodelWhereUniqueInput;
};
/**
 * Basemodel findFirst
 */
export type BasemodelFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * Filter, which Basemodel to fetch.
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Basemodels to fetch.
     */
    orderBy?: Prisma.BasemodelOrderByWithRelationInput | Prisma.BasemodelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Basemodels.
     */
    cursor?: Prisma.BasemodelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Basemodels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Basemodels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Basemodels.
     */
    distinct?: Prisma.BasemodelScalarFieldEnum | Prisma.BasemodelScalarFieldEnum[];
};
/**
 * Basemodel findFirstOrThrow
 */
export type BasemodelFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * Filter, which Basemodel to fetch.
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Basemodels to fetch.
     */
    orderBy?: Prisma.BasemodelOrderByWithRelationInput | Prisma.BasemodelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Basemodels.
     */
    cursor?: Prisma.BasemodelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Basemodels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Basemodels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Basemodels.
     */
    distinct?: Prisma.BasemodelScalarFieldEnum | Prisma.BasemodelScalarFieldEnum[];
};
/**
 * Basemodel findMany
 */
export type BasemodelFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * Filter, which Basemodels to fetch.
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Basemodels to fetch.
     */
    orderBy?: Prisma.BasemodelOrderByWithRelationInput | Prisma.BasemodelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Basemodels.
     */
    cursor?: Prisma.BasemodelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Basemodels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Basemodels.
     */
    skip?: number;
    distinct?: Prisma.BasemodelScalarFieldEnum | Prisma.BasemodelScalarFieldEnum[];
};
/**
 * Basemodel create
 */
export type BasemodelCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * The data needed to create a Basemodel.
     */
    data: Prisma.XOR<Prisma.BasemodelCreateInput, Prisma.BasemodelUncheckedCreateInput>;
};
/**
 * Basemodel createMany
 */
export type BasemodelCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Basemodels.
     */
    data: Prisma.BasemodelCreateManyInput | Prisma.BasemodelCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Basemodel createManyAndReturn
 */
export type BasemodelCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * The data used to create many Basemodels.
     */
    data: Prisma.BasemodelCreateManyInput | Prisma.BasemodelCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Basemodel update
 */
export type BasemodelUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * The data needed to update a Basemodel.
     */
    data: Prisma.XOR<Prisma.BasemodelUpdateInput, Prisma.BasemodelUncheckedUpdateInput>;
    /**
     * Choose, which Basemodel to update.
     */
    where: Prisma.BasemodelWhereUniqueInput;
};
/**
 * Basemodel updateMany
 */
export type BasemodelUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Basemodels.
     */
    data: Prisma.XOR<Prisma.BasemodelUpdateManyMutationInput, Prisma.BasemodelUncheckedUpdateManyInput>;
    /**
     * Filter which Basemodels to update
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * Limit how many Basemodels to update.
     */
    limit?: number;
};
/**
 * Basemodel updateManyAndReturn
 */
export type BasemodelUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * The data used to update Basemodels.
     */
    data: Prisma.XOR<Prisma.BasemodelUpdateManyMutationInput, Prisma.BasemodelUncheckedUpdateManyInput>;
    /**
     * Filter which Basemodels to update
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * Limit how many Basemodels to update.
     */
    limit?: number;
};
/**
 * Basemodel upsert
 */
export type BasemodelUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * The filter to search for the Basemodel to update in case it exists.
     */
    where: Prisma.BasemodelWhereUniqueInput;
    /**
     * In case the Basemodel found by the `where` argument doesn't exist, create a new Basemodel with this data.
     */
    create: Prisma.XOR<Prisma.BasemodelCreateInput, Prisma.BasemodelUncheckedCreateInput>;
    /**
     * In case the Basemodel was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.BasemodelUpdateInput, Prisma.BasemodelUncheckedUpdateInput>;
};
/**
 * Basemodel delete
 */
export type BasemodelDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
    /**
     * Filter which Basemodel to delete.
     */
    where: Prisma.BasemodelWhereUniqueInput;
};
/**
 * Basemodel deleteMany
 */
export type BasemodelDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Basemodels to delete
     */
    where?: Prisma.BasemodelWhereInput;
    /**
     * Limit how many Basemodels to delete.
     */
    limit?: number;
};
/**
 * Basemodel without action
 */
export type BasemodelDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Basemodel
     */
    select?: Prisma.BasemodelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Basemodel
     */
    omit?: Prisma.BasemodelOmit<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Basemodel.d.ts.map