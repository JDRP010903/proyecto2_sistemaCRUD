document.addEventListener("DOMContentLoaded", function() {

    // Damos más tiempo para cambio de cards
    var carouselElement = document.querySelector("#activitiesCarousel");
    var carouselInstance = new bootstrap.Carousel(carouselElement, {
        interval: 200000  // Cambia cada 10 segundos
    });

    const botonCrear = document.getElementById("btnCrear");

    // Función para generar un ID único
    const generarIdUnico = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const obtenerTareas = () => {
        const tareasGuardadas = localStorage.getItem("tareas");
        return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    }

    const guardarTarea = (tarea) => {
        const tareas = obtenerTareas();
        const tareaIndex = tareas.findIndex(t => t.id === tarea.id);
        if (tareaIndex > -1) {
            tareas[tareaIndex] = tarea;
        } else {
            tarea.id = generarIdUnico();
            tareas.push(tarea);
        }
        localStorage.setItem("tareas", JSON.stringify(tareas));
        actualizarCarrusel();
    }

    const editarTarea = (id) => {
        const cardBody = document.getElementById(`card-body-${id}`);
        cardBody.querySelectorAll(".editable").forEach(el => {
            el.contentEditable = true;
        });
        cardBody.querySelector(".btn-confirmar").style.display = "inline-block";
        cardBody.querySelector(".btn-cancelar").style.display = "inline-block";
        cardBody.querySelector(".btnEditarAct").style.display = "none";
        cardBody.querySelector(".btnEliminarAct").style.display = "none";
    }

    const confirmarEdicion = (id) => {
        const cardBody = document.getElementById(`card-body-${id}`);
        const tarea = {
            id: id,
            nombre: cardBody.querySelector(".card-title").innerText,
            descripcion: cardBody.querySelector(".card-text").innerText,
            fechaInicio: cardBody.querySelector(".fechatxt").innerText.split(" - ")[0],
            fechaFin: cardBody.querySelector(".fechatxt").innerText.split(" - ")[1]
        };
        guardarTarea(tarea);
        alert("Edición completada con éxito.");
    }

    const cancelarEdicion = (id) => {
        actualizarCarrusel();
    }

    const eliminarTarea = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            const tareas = obtenerTareas();
            const nuevasTareas = tareas.filter(tarea => tarea.id !== id);
            localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
            actualizarCarrusel();
            alert('Tarea eliminada con éxito.');
        }
    }

    const actualizarCarrusel = () => {
        const carouselInner = document.querySelector("#activitiesCarousel .carousel-inner");
        const carousel_btn_next = document.getElementById("carousel_btn_next");
        const carousel_btn_prev = document.getElementById("carousel_btn_prev")
        const tareas = obtenerTareas();

        carouselInner.innerHTML = "";

        if (tareas.length === 0) {
            carousel_btn_next.style.opacity = 0;
            carousel_btn_prev.style.opacity = 0;
            carouselInner.innerHTML = '<div class="carousel-item active"><div class="d-flex justify-content-center align-items-center" style="height: 200px;"><h5>No hay actividades agregadas</h5></div></div>';
        } else {
            carousel_btn_next.style.opacity = 1;
            carousel_btn_prev.style.opacity = 1;
            tareas.forEach((tarea, index) => {
                const nuevoItem = document.createElement('div');
                nuevoItem.classList.add("carousel-item", ...(index === 0 ? ["active"] : []));

                nuevoItem.innerHTML = `
                <div class="card h-100">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center text-center" id="card-body-${tarea.id}">
                        <h5 class="card-title editable">${tarea.nombre}</h5>
                        <p class="card-text editable">${tarea.descripcion}</p>
                        <p class="card-text fechatxt editable">${tarea.fechaInicio} - ${tarea.fechaFin}</p>
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-primary btn-sm me-2 btnEditarAct">Editar</button>
                            <button class="btn btn-danger btn-sm btnEliminarAct">Eliminar</button>
                            <button class="btn btn-success btn-sm me-2 btn-confirmar" style="display:none;">Confirmar</button>
                            <button class="btn btn-secondary btn-sm btn-cancelar" style="display:none;">Cancelar</button>
                        </div>
                    </div>
                </div>
                `;
                carouselInner.appendChild(nuevoItem);

                // Asignar manejadores de evento a los botones
                nuevoItem.querySelector(".btnEditarAct").addEventListener("click", () => editarTarea(tarea.id));
                nuevoItem.querySelector(".btnEliminarAct").addEventListener("click", () => eliminarTarea(tarea.id));
                nuevoItem.querySelector(".btn-confirmar").addEventListener("click", () => confirmarEdicion(tarea.id));
                nuevoItem.querySelector(".btn-cancelar").addEventListener("click", () => cancelarEdicion(tarea.id));
            });
        }
    }

    const manejarCreacion = () => {
        const nombre = document.getElementById("inputTareaActividad").value;
        const descripcion = document.getElementById("inputDescripcion").value;
        const fechaInicio = document.getElementById("inputFechaInicio").value;
        const fechaFin = document.getElementById("inputFechaFin").value;

        if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
            alert("Todos los campos deben estar llenos.");
            return;
        }

        const tarea = { nombre, descripcion, fechaInicio, fechaFin };
        guardarTarea(tarea);
        document.querySelector("form").reset();
        alert("Tarea creada con éxito.");
    }

    botonCrear.addEventListener("click", manejarCreacion);

    actualizarCarrusel();
});
