<template>
    <!---use FormKit to store and validation inputs value--->
    <FormKit type="form" @submit="edit" #default="{ value }" :incomplete-message="false" :actions="false">
        <div class="card card-body mb-6">
            <div v-if="errors.length > 0" class="alert alert-danger">
                <ul class="mb-0">
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </div>

            <div class="row g-4  mb-3">
                <div class="col col-md-6">
                    <FormKit type="text" name="title" id="title" label="عنوان" label-class="form-label"
                        input-class="form-control" validation="required"
                        :validation-messages="{ required: 'فیلد عنوان الزامیست' }"
                        messages-class="form-text text-danger" :value="props.address.title" />
                </div>
                <div class="col col-md-6">
                    <FormKit type="text" name="cellphone" id="cellphone" label="شماره تماس" label-class="form-label"
                        input-class="form-control" :validation="[['required'], ['matches', /^(\+98|0)?9\d{9}$/]]"
                        :validation-messages="{ required: 'فیلد شماره تماس الزامیست', 'matches': 'فیلد شماره تماس معتبر نمیباشد' }"
                        messages-class="form-text text-danger" :value="props.address.cellphone" />
                </div>
                <div class="col col-md-6">
                    <FormKit type="text" name="postal_code" id="postal_code" label="کد پستی" label-class="form-label"
                        input-class="form-control" :validation="[['required'], ['matches', /^\d{5}[ -]?\d{5}$/i]]"
                        :validation-messages="{ required: 'فیلد کدپستی الزامیست', 'matches': 'فیلد کدپستی معتبر نمیباشد' }"
                        messages-class="form-text text-danger" :value="props.address.postal_code" />
                </div>
                
                <ClientOnly fallback-tag="span" fallback="در حال بارگذاری ...">
                    <div class="col col-md-6">
                        <FormKit type="select" name="province_id" id="province_id" label="استان"
                            @change="changeProvince" label-class="form-label" input-class="form-select"
                            validation="required" :validation-messages="{ required: 'فیلد استان الزامیست' }"
                            messages-class="form-text text-danger" :value="props.address.province_id">
                            <option v-for="province in props.provinces" :key="province.id" :value="province.id">
                                {{ province.name }}
                            </option>
                        </FormKit>
                    </div>
                    <div class="col col-md-6">
                        <FormKit type="select" ref="cityEl" name="city_id" id="city_id" label="شهر"
                            label-class="form-label" input-class="form-select" validation="required"
                            :validation-messages="{ required: 'فیلد شهر الزامیست' }"
                            messages-class="form-text text-danger" :value="props.address.city_id">
                            <option v-for="city in props.cities.filter((item) => item.province_id == value.province_id)"
                                :key="city.id" :value="city.id">
                                {{ city.name }}
                            </option>
                        </FormKit>
                    </div>
                </ClientOnly>

                <div class="col col-md-12 text-rose-500">
                    <FormKit type="textarea" rows="5" name="address" id="address" label="آدرس" label-class="form-label"
                        input-class="form-control" validation="required"
                        :validation-messages="{ required: 'فیلد آدرس الزامیست' }" messages-class="form-text text-danger"
                        :value="props.address.address" />
                </div>
            </div>
            <div class="d-flex justify-content-between mt-4">
                <FormKit type="submit" input-class="px-4 py-2 rounded-xl bg-black text-white duration-500 transition-all hover:scale-95 hover:shadow-xl hover:shadow-black">
                    ویرایش
                    <!---loader--->
                    <div v-if="loading" class="spinner-border spinner-border-sm ms-2 "></div>
                </FormKit>
                <ProfileAddressesDelete :addressId="props.address.id"/>
            </div>
        </div>
    </FormKit>
    <hr />
</template>

<script setup>

//// define props for user addresses info
const props = defineProps(['address', 'provinces', 'cities'])
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
/// a function for send and edit data in server side
async function edit(formData) {
  
    try {
        /// enablae loader
        loading.value = true;
        errors.value = [];
/// send new data to edit user addresses data in server side
        await $fetch('/api/profile/address/edit', {
            method: 'POST',
            body: { ...formData, address_id: props.address.id }
        })
/// create a tostr to show success massage 
        toastr.success("ویرایش آدرس باموفقیت انجام شد");
    } catch (error) {
        ///define a new value for errors varible if err exist
        errors.value = Object.values(error.data.data.message).flat();
    } finally {
        /// disablae loader
        loading.value = false;
    }
}
</script>