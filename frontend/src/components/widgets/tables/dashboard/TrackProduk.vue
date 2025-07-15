<template>
    <div :class="widgetClasses" class="card shadow-sm">
        <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold fs-3 mb-1">Recent Product</span>
                <span class="text-muted mt-1 fw-semibold fs-7">{{ data.length }} produk yang tersedia</span>
            </h3>
            <div class="card-toolbar">
                <button class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary" 
                        @click="refreshData">
                    <i class="ki-duotone ki-arrows-circle fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                </button>
            </div>
        </div>
        <div class="card-body py-3">
            <div class="table-responsive">
                <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr class="fw-bold text-muted">
                            <th v-for="header in table.getFlatHeaders()" :key="header.id" 
                                class="min-w-100px">
                                <FlexRender
                                    :render="header.column.columnDef.header"
                                    :props="header.getContext()"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 fw-semibold">
                        <tr v-for="row in table.getRowModel().rows" :key="row.id">
                            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination Controls -->
            <div class="row" v-if="table.getPageCount() > 1">
                <div class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start">
                    <div class="dataTables_length">
                        <label>
                            <select v-model="pageSize" @change="table.setPageSize(Number(pageSize))" 
                                    class="form-select form-select-sm form-select-solid">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                    <div class="dataTables_paginate">
                        <ul class="pagination">
                            <li class="page-item" :class="{ disabled: !table.getCanPreviousPage() }">
                                <button class="page-link" @click="table.previousPage()" 
                                        :disabled="!table.getCanPreviousPage()">
                                    Previous
                                </button>
                            </li>
                            <li class="page-item" 
                                v-for="page in getPageNumbers()" 
                                :key="page" 
                                :class="{ active: page === table.getState().pagination.pageIndex + 1 }">
                                <button class="page-link" @click="table.setPageIndex(page - 1)">
                                    {{ page }}
                                </button>
                            </li>
                            <li class="page-item" :class="{ disabled: !table.getCanNextPage() }">
                                <button class="page-link" @click="table.nextPage()" 
                                        :disabled="!table.getCanNextPage()">
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getAssetPath } from '@/core/helpers/assets';
import { defineComponent, ref, h } from 'vue';
import { useVueTable, FlexRender, getCoreRowModel, getPaginationRowModel, createColumnHelper, type ColumnDef } from '@tanstack/vue-table';

// Define the product interface
interface Product {
    id: number;
    name: string;
    source: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// Sample data
const sampleData: Product[] = [
    { id: 1, name: 'MacBook Pro 13"', source: 'Apple Store', stock: 25, status: 'In Stock' },
    { id: 2, name: 'iPhone 14 Pro', source: 'Distributor A', stock: 5, status: 'Low Stock' },
    { id: 3, name: 'iPad Air', source: 'Apple Store', stock: 0, status: 'Out of Stock' },
    { id: 4, name: 'AirPods Pro', source: 'Distributor B', stock: 150, status: 'In Stock' },
    { id: 5, name: 'Apple Watch Series 8', source: 'Apple Store', stock: 12, status: 'In Stock' },
    { id: 6, name: 'Mac Mini', source: 'Distributor A', stock: 8, status: 'Low Stock' },
    { id: 7, name: 'Studio Display', source: 'Apple Store', stock: 3, status: 'Low Stock' },
    { id: 8, name: 'Magic Mouse', source: 'Distributor C', stock: 45, status: 'In Stock' },
];

export default defineComponent({
    name: "TrackProduk",
    components: {
        FlexRender,
    },
    props: {
        widgetClasses: String,
    },
    setup() {
        const data = ref<Product[]>(sampleData);
        const pageSize = ref(5);
        
        // Create column helper
        const columnHelper = createColumnHelper<Product>();
        
        // Define columns with Vue render functions
        const columns: ColumnDef<Product, any>[] = [
            columnHelper.display({
                id: 'select',
                header: 'Select',
                cell: ({ row }) => h('div', { class: 'form-check form-check-custom form-check-solid' }, [
                    h('input', { 
                        class: 'form-check-input', 
                        type: 'checkbox', 
                        value: row.original.id.toString()
                    })
                ]),
                size: 50,
            }),
            columnHelper.accessor('name', {
                header: 'Nama Produk',
                cell: info => h('div', { class: 'd-flex align-items-center' }, [
                    h('div', { class: 'symbol symbol-45px me-5' }, [
                        h('img', { 
                            alt: 'Product', 
                            src: getAssetPath('media/stock/ecommerce/1.gif') 
                        })
                    ]),
                    h('div', { class: 'd-flex justify-content-start flex-column' }, [
                        h('span', { class: 'text-dark fw-bold text-hover-primary fs-6' }, info.getValue()),
                        h('span', { class: 'text-muted fw-semibold text-muted d-block fs-7' }, `ID: ${info.row.original.id}`)
                    ])
                ]),
            }),
            columnHelper.accessor('source', {
                header: 'Sumber Pembelian',
                cell: info => h('span', { class: 'text-dark fw-semibold d-block fs-7' }, info.getValue()),
            }),
            columnHelper.accessor('stock', {
                header: 'Sisa Stock',
                cell: info => {
                    const stock = info.getValue();
                    const status = info.row.original.status;
                    let badgeClass = 'badge-light-success';
                    
                    if (status === 'Low Stock') badgeClass = 'badge-light-warning';
                    if (status === 'Out of Stock') badgeClass = 'badge-light-danger';
                    
                    return h('div', { class: 'd-flex flex-column' }, [
                        h('span', { class: 'text-dark fw-bold fs-6' }, `${stock} units`),
                        h('span', { class: `badge ${badgeClass} fs-7` }, status)
                    ]);
                }
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => h('div', { class: 'd-flex justify-content-end flex-shrink-0' }, [
                    h('button', { 
                        class: 'btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1',
                        title: 'View',
                        onClick: () => handleView(row.original.id)
                    }, [
                        h('i', { class: 'ki-duotone ki-switch fs-2' }, [
                            h('span', { class: 'path1' }),
                            h('span', { class: 'path2' })
                        ])
                    ]),
                    h('button', { 
                        class: 'btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1',
                        title: 'Edit',
                        onClick: () => handleEdit(row.original.id)
                    }, [
                        h('i', { class: 'ki-duotone ki-pencil fs-2' }, [
                            h('span', { class: 'path1' }),
                            h('span', { class: 'path2' })
                        ])
                    ]),
                    h('button', { 
                        class: 'btn btn-icon btn-bg-light btn-active-color-primary btn-sm',
                        title: 'Delete',
                        onClick: () => handleDelete(row.original.id)
                    }, [
                        h('i', { class: 'ki-duotone ki-trash fs-2' }, [
                            h('span', { class: 'path1' }),
                            h('span', { class: 'path2' }),
                            h('span', { class: 'path3' }),
                            h('span', { class: 'path4' }),
                            h('span', { class: 'path5' })
                        ])
                    ])
                ]),
                size: 150,
            }),
        ];

        // Create table instance
        const table = useVueTable({
            get data() {
                return data.value;
            },
            columns,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            initialState: {
                pagination: {
                    pageSize: pageSize.value,
                },
            },
        });

        // Action handlers
        const handleView = (id: number) => {
            console.log('View product:', id);
            // Add your view logic here
        };

        const handleEdit = (id: number) => {
            console.log('Edit product:', id);
            // Add your edit logic here
        };

        const handleDelete = (id: number) => {
            console.log('Delete product:', id);
            // Add confirmation dialog and delete logic here
            if (confirm('Are you sure you want to delete this product?')) {
                data.value = data.value.filter(item => item.id !== id);
            }
        };

        // Methods
        const refreshData = () => {
            console.log('Refreshing data...');
            // You can add API call here to refresh data
            // For demo, let's just shuffle the data
            data.value = [...data.value].sort(() => Math.random() - 0.5);
        };

        const getPageNumbers = () => {
            const totalPages = table.getPageCount();
            const currentPage = table.getState().pagination.pageIndex + 1;
            const pages: number[] = [];
            
            // Simple pagination logic - show max 5 pages
            const maxPages = Math.min(5, totalPages);
            let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
            let endPage = Math.min(totalPages, startPage + maxPages - 1);
            
            if (endPage - startPage + 1 < maxPages) {
                startPage = Math.max(1, endPage - maxPages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            return pages;
        };

        return {
            data,
            pageSize,
            table,
            refreshData,
            getPageNumbers,
            handleView,
            handleEdit,
            handleDelete,
            getAssetPath,
        };
    },
})
</script>