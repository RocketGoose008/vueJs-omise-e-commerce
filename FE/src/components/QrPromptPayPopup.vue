<template>
  <div v-if="visible" class="qr-popup-overlay" @click.self="$emit('close')">
    <div class="qr-popup-content">
      <!-- ตัว QR Code และปุ่มปิด -->
      <img :src="qrUri" alt="QR Code" />
    </div>
  </div>
</template>

<script>
    export default {
        props: {
            visible: { type: Boolean, required: true },
            qrUri: { type: String, required: true },
        }
    }
</script>
