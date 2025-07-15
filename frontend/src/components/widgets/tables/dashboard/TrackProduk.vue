<template>
    <div :class="widgetClasses" class="card">
        <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold fs-3 mb-1">Recent Product</span>

                <span class="text-muted mt-1 fw-semibold fs-7">{total produk yang telah terjual}</span>
            </h3>
            <div class="card-toolbar">
                <button>

                </button>
            </div>
        </div>
        <div class="card-body py-3">
            <div class="table-responsive">
                <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr class="fw-bold text-muted">
                            <th class="w-25px">
                                <div class="form-check form-check-custom form-check-solid">
                                    <input class="form-check-input" type="checkbox"
                                        onchange="checkedRows.length === 6 ? (checkedRows.length = 0) : (checkedRows = [0,1,2,3,4,5,6])
                                        "
                                    />
                                </div>
                            </th>
                            <th class="min-w-170px">Nama Produk</th>
                            <th class="min-w-170px">Sumber Pembelian</th>
                            <th class="min-w-150px">Sisa Stock</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getAssetPath } from '@/core/helpers/assets';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: "TrackProduk",
    components:{

    },
    props: {
        widgetClasses: String,
    },
    setup() {
        const checkedRows = ref<Array<number>>([]);
        const list = null;
        
        return {
            list,
            checkedRows,
            getAssetPath
        }
    },
})
</script>