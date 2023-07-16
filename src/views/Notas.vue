<template>
  <div class="container">
    <h1>Notas</h1>
    <div>
      <b-alert
        :show="dismissCountDown"
        dismissible
        :variant="mensaje.color"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        {{ mensaje.texto }} | cerrando en {{ dismissCountDown }} segundos...
      </b-alert>

      <form @submit.prevent="editarNota(notaEditar)" v-if="editar">
        <h3>Editar Nota</h3>
        <input
          class="form-control my-2"
          type="text"
          placeholder="Nombre"
          v-model="notaEditar.nombre"
        />
        <input
          class="form-control my-2"
          type="text"
          placeholder="Descripción"
          v-model="notaEditar.descripcion"
        />
        <button class="btn btn-warning mx-2" type="submit">Actualizar</button>
        <button
          class="btn btn-danger mx-2"
          type="submit"
          @click="editar = false"
        >
          Cancelar
        </button>
      </form>

      <form @submit.prevent="agregarNota()" v-if="!editar">
        <h3>Agregar Nota</h3>
        <input
          class="form-control my-2"
          type="text"
          placeholder="Nombre"
          v-model="nota.nombre"
        />
        <input
          class="form-control my-2"
          type="text"
          placeholder="Descripción"
          v-model="nota.descripcion"
        />
        <div class="d-grid gap-2">
          <button class="btn btn-success" type="submit">Agregar</button>
        </div>
      </form>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notas" :key="index">
          <th scope="row">{{ item._id }}</th>
          <td>{{ item.nombre }}</td>
          <td>{{ item.descripcion }}</td>
          <td>
            <b-button @click="eliminarNota(item._id)" class="btn-danger mx-2"
              >Eliminar</b-button
            >
            <b-button @click="activarEdicion(item._id)" class="btn-warning mx-2"
              >Editar</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mensaje: { color: "", texto: "" },
      dismissSecs: 5,
      dismissCountDown: 0,
      notas: [],
      nota: { nombre: "", descripcion: "" },
      editar: false,
      notaEditar: {},
    };
  },
  created() {
    this.listarNotas();
  },
  methods: {
    alerta() {
      this.mensaje.color = "success";
      this.mensaje.texto = "probando alerta";
      this.showAlert();
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    activarEdicion(id) {
      this.editar = true;
      console.log(id);
      this.axios
        .get(`/nota/${id}`)
        .then((res) => {
          this.notaEditar = res.data;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    editarNota(item) {
      this.axios
        .put(`/nota/${item._id}`, item)
        .then((res) => {
          const index = this.notas.findIndex((n) => n._id === res.data._id);
          this.notas[index].nombre = res.data.nombre;
          this.notas[index].descripcion = res.data.descripcion;
          this.mensaje.color = "success";
          this.mensaje.texto = "Nota Editada!";
          this.showAlert();
          this.editar = false;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    eliminarNota(id) {
      console.log(id);
      this.axios
        .delete(`/nota/${id}`)
        .then((res) => {
          const index = this.notas.findIndex(
            (item) => item._id === res.data.id
          );
          this.notas.splice(index, 1);
          this.mensaje.color = "success";
          this.mensaje.texto = "Nota eliminada!";
          this.showAlert();
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    agregarNota() {
      this.axios
        .post("/nueva-nota", this.nota)
        .then((res) => {
          this.notas.push(res.data);
          this.nota.nombre = "";
          this.nota.descripcion = "";
          this.mensaje.color = "success";
          this.mensaje.texto = "Nota agregada!";
          this.showAlert();
        })
        .catch((e) => {
          console.log(e.response);
          if (e.response.data.error.errors.nombre.message) {
            this.mensaje.texto = e.response.data.error.errors.nombre.message;
          } else {
            this.mensaje.texto = "Error del Sistema!";
          }
          this.mensaje.color = "danger";
          this.showAlert();
        });
    },
    listarNotas() {
      this.axios
        .get("/nota")
        .then((res) => {
          console.log(res.data);
          this.notas = res.data;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
  },
};
</script>