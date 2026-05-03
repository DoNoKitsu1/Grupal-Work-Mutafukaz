# Pokédex — SCESI Postulación 2026

Aplicación web que consume la [PokéAPI](https://pokeapi.co/) para explorar los primeros 1025 Pokémon. Proyecto grupal de postulación a SCESI.

## Demo

Abre `index.html` en el navegador. No requiere servidor ni dependencias.

## Funcionalidades

- **Grid de tarjetas** — muestra 10 Pokémon por página con imagen oficial, número, nombre y tipos con colores
- **Paginación** — navega por los 1025 Pokémon disponibles
- **Buscador con autocompletado** — filtra por nombre en tiempo real con sugerencias (hasta 5 resultados)
- **Modal de detalle** — al hacer clic en una tarjeta muestra:
  - Altura y peso
  - Stats con barra de progreso (HP, Ataque, Defensa, Ataque Esp., Defensa Esp., Velocidad)
  - 3 movimientos aleatorios
  - Toggle para ver versión **shiny** ✨

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 / CSS3 / JS vanilla | Base del proyecto |
| [PokéAPI v2](https://pokeapi.co/) | Datos de Pokémon |
| Press Start 2P / Nunito | Fuentes (Google Fonts) |

## Estructura de archivos

```
├── index.html   # Estructura HTML y modal
├── style.css    # Estilos, colores por tipo, responsive
├── app.js       # Lógica: fetch, render, paginación, búsqueda, modal
└── favicon.svg  # Ícono
```

## Equipo

| Rol | Responsabilidad |
|---|---|
| **Maquetador** | Estructura HTML base (`index.html`) y estilos (`style.css`) |
| **Motor** | Fetch de lista, render de tarjetas, lógica de paginación |
| **Dataminer** | Fetch de detalle, medidas, movimientos, shiny |
| **Especialista** | Fetch de nombres, buscador con autocompletado y navegación al modal |

## Lecciones aprendidas (gestión del repositorio)

- Siempre verificar la rama de origen antes de aprobar un PR
- Evitar commits directos a `develop`; usar feature branches con PR
- La revisión de PR debe incluir verificar rama base y rama de comparación

## Bitacora 
1. Yo hice la estructura index y style sin que me apruben direcamtente lo meti 
2. Mateo hizo pr de su feat en main y le aprobamos sin verificar en que rama estaba pusheando (skill issue). Y bueno se mergeo
3. Joel hizo commits directamente en develop

## DISCLAIMER 

**La tarean se dividio pensado en 4 integrantes, se le asignos sus tasks siguiendo metodoligia git flow al cuarto integrante pero no realizo su parte, para tener algo funcional y por falta de tiempo  nos vimos en la necesidad en la ultima hora de cambiar de 3 reviws a 2 y de hacer sus task con claude.** Att: wGamba
