<template>
    <button class="btn btn-primary mb-3" data-bs-toggle="collapse" data-bs-target="#collapseExample"
        aria-expanded="false" aria-controls="collapseExample">
        ایجاد آدرس جدید
    </button>
   
<div class="collapse mt-3" id="collapseExample">
    <!---use FormKit to store and validation inputs value--->
        <FormKit type="form" id="createAddress" @submit="create" #default="{ value }" :incomplete-message="false" :actions="false">
            <div class="card card-body">
                <div v-if="errors.length > 0" class="alert alert-danger">
                    <ul class="mb-0">
                        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                    </ul>
                </div>

                <div class="row g-4 mb-3">
                    <div class="col col-md-6 ">
                        <FormKit type="text" name="title" id="title" label="عنوان" label-class="form-label"
                            input-class="form-control" validation="required"
                            :validation-messages="{ required: 'فیلد عنوان الزامیست' }"
                            messages-class="form-text text-danger" />
                    </div>
                    <div class="col col-md-6">
                        <FormKit type="text" name="cellphone" id="cellphone" label="شماره تماس" label-class="form-label"
                            input-class="form-control" :validation="[['required'], ['matches', /^(\+98|0)?9\d{9}$/]]"
                            :validation-messages="{ required: 'فیلد شماره تماس الزامیست', 'matches': 'فیلد شماره تماس معتبر نمیباشد' }"
                            messages-class="form-text text-danger" />
                    </div>
                    <div class="col col-md-6">
                        <FormKit type="text" name="postal_code" id="postal_code" label="کد پستی"
                            label-class="form-label" input-class="form-control"
                            :validation="[['required'], ['matches', /^\d{5}[ -]?\d{5}$/i]]"
                            :validation-messages="{ required: 'فیلد کدپستی الزامیست', 'matches': 'فیلد کدپستی معتبر نمیباشد' }"
                            messages-class="form-text text-danger" />
                    </div>
                    <div class="col col-md-6">
                        <FormKit type="select" name="province_id" id="province_id" label="استان"
                            @change="changeProvince" label-class="form-label" input-class="form-select"
                            validation="required" :validation-messages="{ required: 'فیلد استان الزامیست' }"
                            messages-class="form-text text-danger">
                            <option v-for="province in props.provinces" :key="province.id" :value="province.id">
                                {{ province.name }}
                            </option>
                        </FormKit>
                    </div>
                    <div class="col col-md-6">
                        <FormKit type="select" ref="cityEl" name="city_id" id="city_id" label="شهر"
                            label-class="form-label" input-class="form-select" validation="required"
                            :validation-messages="{ required: 'فیلد شهر الزامیست' }"
                            messages-class="form-text text-danger">
                            <option v-for="city in props.cities.filter((item) => item.province_id == value.province_id)"
                                :key="city.id" :value="city.id">
                                {{ city.name }}
                            </option>
                        </FormKit>
                    </div>

                    <div class="col col-md-12 ">
                        <FormKit type="textarea" rows="5" name="address" id="address" label="آدرس"
                            label-class="form-label" input-class="form-control" validation="required"
                            :validation-messages="{ required: 'فیلد آدرس الزامیست' }"
                            messages-class="form-text text-danger" />
                    </div>
                </div>
                <div>
                    <FormKit type="submit" input-class="btn btn-primary bg-black hover:scale-95 hover:shadow-xl hover:shadow-black transition-all duration-500 mt-4">
                        ایجاد
                         <!---loader--->
                        <div v-if="loading" class="spinner-border spinner-border-sm ms-2 opacity-70"></div>
                    </FormKit>
                </div>
            </div>
        </FormKit>
    </div>
</template>

<script setup>
///define FormKit 
import { reset } from "@formkit/core"
/// define props
const props = defineProps(['provinces', 'cities'])
/// create a variable to store the cites
const cityEl = ref(null);
/// create a variable for catch and store errors
const errors = ref([]);
/// create a variable to for loader postion
const loading = ref(false);

/// a function to change cities when province changed
function changeProvince(el) {
    cityEl.value.node.input(props.cities.find((item) => item.province_id == el.target.value).id)
}
/// a function to send new data into the server side
async function create(formData) {
    console.log(formData);

    try {
        loading.value = true;
      //  errors.value = [];
/// send new data to create a new addresses in the server side
        await $fetch('/api/profile/create', {
            method: 'POST',
            body: formData
        })
/// use reset method to clear all input value of FormKit
        reset('createAddress')
/// create a tostr to show success massage 
        toastr.success("ایجاد آدرس باموفقیت انجام شد");
    } catch (error) {
//    errors.value = Object.values(error.data.data.message).flat();
    console.log(error);
    } finally {
//  loading.value = false;
    }
}

</script>