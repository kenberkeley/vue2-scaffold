<template>
  <div style="padding: 10px; border: 1px solid #ddd">
    {{ msg }}
  </div>
</template>
<script>
export default {
  data: () => ({
    msg: ''
  }),
  mounted () {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/helloworld')
    xhr.onload = e => {
      if (xhr.status === 200) {
        this.msg = e.target.responseText
      }
    }
    xhr.send()
  }
}
</script>
