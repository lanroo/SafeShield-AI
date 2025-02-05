import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  LocationCity as LocationCityIcon,
  Speed as SpeedIcon,
  FilterAlt as FilterAltIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { Attack } from "../../types/components";
import {
  WorldTopology,
  GeoFeatureCollection,
  GeoFeature,
} from "../../types/topojson";

const width = 1200;
const height = 600;
const minZoom = 1;
const maxZoom = 8;

export default function AttackMap() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<WorldTopology | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [attackSpeed, setAttackSpeed] = useState<number>(200);
  const [showAllCities, setShowAllCities] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["ALL"]);

  useEffect(() => {
    // Carrega o mapa do mundo do TopoJSON
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
      .then((response) => response.json())
      .then((data: WorldTopology) => {
        setWorldData(data);
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !worldData) return;

    // Limpa o SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Configuração do mapa
    const projection = d3
      .geoMercator()
      .scale(170)
      .translate([width / 2, height / 1.4]);

    const path = d3.geoPath().projection(projection);

    // Cria o SVG
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background-color", isDark ? "transparent" : "#eef0f4");

    // Grupo principal para aplicar transformações
    const g = svg.append("g");

    // Adiciona o mapa base
    const world = topojson.feature(
      worldData,
      worldData.objects.countries
    ) as GeoFeatureCollection;

    g.selectAll<SVGPathElement, GeoFeature>("path")
      .data(world.features)
      .enter()
      .append("path")
      .attr("d", function (d) {
        return path(d) || "";
      })
      .style("fill", "#2a3442")
      .style("stroke", "#3f4b5b")
      .style("stroke-width", "0.5px")
      .style("vector-effect", "non-scaling-stroke");

    // Adiciona pontos de alerta
    const alertPoints = [
      { color: "#ff0000", count: 50, opacity: 0.4 }, // Vermelho (crítico)
      { color: "#ff4500", count: 35, opacity: 0.35 }, // Laranja (alto)
      { color: "#00ccff", count: 25, opacity: 0.3 }, // Ciano (médio)
    ];

    // Adiciona pontos apenas dentro dos países
    alertPoints.forEach(({ color, count, opacity }) => {
      // Distribui os pontos entre os países
      for (let i = 0; i < count; i++) {
        // Seleciona um país aleatório
        const randomFeature =
          world.features[Math.floor(Math.random() * world.features.length)];

        // Tenta encontrar um ponto válido dentro do país
        let attempts = 0;
        let validPoint = false;

        while (!validPoint && attempts < 15) {
          // Calcula o bounding box do país
          const bounds = path.bounds(randomFeature);

          // Gera um ponto aleatório dentro do bounding box
          const x =
            bounds[0][0] + Math.random() * (bounds[1][0] - bounds[0][0]);
          const y =
            bounds[0][1] + Math.random() * (bounds[1][1] - bounds[0][1]);

          // Cria o grupo para o alerta
          const alertGroup = g.append("g");

          // Círculo externo (halo)
          alertGroup
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 4)
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", "1px")
            .style("opacity", opacity);

          // Ponto central
          const point = alertGroup
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 2)
            .style("fill", color)
            .style("opacity", opacity + 0.2);

          // Animação de alerta
          function pulse() {
            const duration = 2000 + Math.random() * 1000;

            // Anima o halo
            alertGroup
              .select("circle:first-child")
              .transition()
              .duration(duration)
              .attr("r", 8)
              .style("opacity", 0)
              .transition()
              .duration(0)
              .attr("r", 4)
              .style("opacity", opacity)
              .on("end", pulse);

            // Pisca o ponto central
            point
              .transition()
              .duration(duration / 2)
              .style("opacity", opacity + 0.4)
              .transition()
              .duration(duration / 2)
              .style("opacity", opacity + 0.2);
          }

          // Inicia a animação com delay aleatório
          setTimeout(pulse, Math.random() * 2000);
          validPoint = true;
          attempts++;
        }
      }
    });

    // Configuração do zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        const scale = event.transform.k;
        g.selectAll("path").style("stroke-width", `${0.5 / scale}px`);
        g.selectAll("circle").attr("r", (_d, i, nodes) => {
          const baseRadius = d3.select(nodes[i]).attr("data-base-radius");
          return baseRadius ? Number(baseRadius) / scale : 3 / scale;
        });
      });

    svg.call(zoom);

    // Função para adicionar um ataque
    const addAttack = (attack: Attack) => {
      const sourcePos = projection(attack.source);
      const targetPos = projection(attack.target);

      // Verifica se as coordenadas são válidas
      if (
        !sourcePos ||
        !targetPos ||
        isNaN(sourcePos[0]) ||
        isNaN(sourcePos[1]) ||
        isNaN(targetPos[0]) ||
        isNaN(targetPos[1])
      ) {
        return;
      }

      // Linha do ataque
      const line = g
        .append("path")
        .attr(
          "d",
          `M${sourcePos[0]},${sourcePos[1]}L${targetPos[0]},${targetPos[1]}`
        )
        .style("fill", "none")
        .style("stroke", "rgba(0, 255, 255, 0.2)")
        .style("stroke-width", "2px")
        .style("vector-effect", "non-scaling-stroke");

      // Animação da linha
      const length = (line.node() as SVGPathElement).getTotalLength();
      line
        .style("stroke-dasharray", `${length} ${length}`)
        .style("stroke-dashoffset", length)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("stroke-dashoffset", 0)
        .on("end", () => {
          line.transition().duration(200).style("opacity", 0).remove();
        });

      // Ponto de origem
      g.append("circle")
        .attr("cx", sourcePos[0])
        .attr("cy", sourcePos[1])
        .attr("r", 3)
        .attr("data-base-radius", 3)
        .style("fill", "#ff3e3e")
        .style("filter", "drop-shadow(0 0 6px rgba(255, 62, 62, 0.8))")
        .transition()
        .duration(2000)
        .style("opacity", 0)
        .remove();

      // Ponto de destino
      const target = g
        .append("circle")
        .attr("cx", targetPos[0])
        .attr("cy", targetPos[1])
        .attr("r", 0)
        .attr("data-base-radius", 4)
        .style("fill", "#00ffff")
        .style("filter", "drop-shadow(0 0 6px rgba(0, 255, 255, 0.8))");

      target
        .transition()
        .duration(300)
        .attr("r", 4)
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
    };

    // Simulação de ataques aleatórios
    const generateRandomAttack = () => {
      // Países com alta intensidade de ataques (IDs)
      const highIntensityCountries = [
        199, 214, 211, 178, 110, 162, 17, 203, 134, 58, 221, 44, 127,
      ];

      // Obtém os centroides dos países de alta intensidade
      const highIntensityTargets = world.features
        .filter((_, index) => highIntensityCountries.includes(index + 1))
        .map((feature) => path.centroid(feature))
        .filter((coords) => coords && !isNaN(coords[0]) && !isNaN(coords[1]));

      // 70% de chance de usar um país de alta intensidade
      const useHighIntensity = Math.random() < 0.7;

      let source, target;
      if (useHighIntensity) {
        // Seleciona aleatoriamente entre os países de alta intensidade
        source =
          highIntensityTargets[
            Math.floor(Math.random() * highIntensityTargets.length)
          ];
        target =
          highIntensityTargets[
            Math.floor(Math.random() * highIntensityTargets.length)
          ];
      } else {
        // Usa as cidades padrão para o resto dos ataques
        const attacks: [number, number][] = [
          [-23.5505, -46.6333], // São Paulo
          [40.7128, -74.006], // New York
          [51.5074, -0.1278], // London
          [35.6762, 139.6503], // Tokyo
          [22.3964, 114.1095], // Hong Kong
          [-33.8688, 151.2093], // Sydney
          [55.7558, 37.6173], // Moscow
          [48.8566, 2.3522], // Paris
          [1.3521, 103.8198], // Singapore
          [-33.9249, 18.4241], // Cape Town
        ];
        source = projection(
          attacks[Math.floor(Math.random() * attacks.length)]
        );
        target = projection(
          attacks[Math.floor(Math.random() * attacks.length)]
        );
      }

      if (source && target && source !== target) {
        // Verifica se as coordenadas são válidas antes de adicionar o ataque
        if (
          !isNaN(source[0]) &&
          !isNaN(source[1]) &&
          !isNaN(target[0]) &&
          !isNaN(target[1])
        ) {
          addAttack({
            source: [source[0], source[1]],
            target: [target[0], target[1]],
            type: "attack",
          });
        }
      }

      // Gera múltiplos ataques simultaneamente para países de alta intensidade
      if (useHighIntensity) {
        const numExtraAttacks = Math.floor(Math.random() * 3) + 1; // 1 a 3 ataques extras
        for (let i = 0; i < numExtraAttacks; i++) {
          const extraSource =
            highIntensityTargets[
              Math.floor(Math.random() * highIntensityTargets.length)
            ];
          const extraTarget =
            highIntensityTargets[
              Math.floor(Math.random() * highIntensityTargets.length)
            ];

          if (extraSource && extraTarget && extraSource !== extraTarget) {
            if (
              !isNaN(extraSource[0]) &&
              !isNaN(extraSource[1]) &&
              !isNaN(extraTarget[0]) &&
              !isNaN(extraTarget[1])
            ) {
              addAttack({
                source: [extraSource[0], extraSource[1]],
                target: [extraTarget[0], extraTarget[1]],
                type: "attack",
              });
            }
          }
        }
      }
    };

    // Inicia a simulação com intervalo mais curto para mais ataques
    const interval = setInterval(generateRandomAttack, 500);

    return () => clearInterval(interval);
  }, [worldData, isDark]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "transparent",
        border: `1px solid ${
          isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
        }`,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: isDark ? "#00ffff" : "#1e3a5c",
          mb: 2,
        }}
      >
        Mapa de Ataques em Tempo Real
      </Typography>

      {/* Barra de Controles */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
          p: 1,
          borderRadius: 1,
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(255, 255, 255, 0.1)",
          border: `1px solid ${
            isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
          }`,
        }}
      >
        <Tooltip title="Mostrar Nomes dos Países">
          <IconButton
            onClick={() => setShowLabels(!showLabels)}
            sx={{
              color: showLabels ? (isDark ? "#00ffff" : "#1e3a5c") : "grey.500",
              backgroundColor: showLabels
                ? isDark
                  ? "rgba(0, 255, 255, 0.1)"
                  : "rgba(30, 58, 92, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(0, 255, 255, 0.2)"
                  : "rgba(30, 58, 92, 0.2)",
              },
            }}
          >
            {showLabels ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Mostrar Todas as Cidades">
          <IconButton
            onClick={() => setShowAllCities(!showAllCities)}
            sx={{
              color: showAllCities
                ? isDark
                  ? "#00ffff"
                  : "#1e3a5c"
                : "grey.500",
              backgroundColor: showAllCities
                ? isDark
                  ? "rgba(0, 255, 255, 0.1)"
                  : "rgba(30, 58, 92, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(0, 255, 255, 0.2)"
                  : "rgba(30, 58, 92, 0.2)",
              },
            }}
          >
            <LocationCityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Velocidade dos Ataques">
          <IconButton
            onClick={() => setAttackSpeed(attackSpeed === 200 ? 50 : 200)}
            sx={{
              color:
                attackSpeed === 50
                  ? isDark
                    ? "#00ffff"
                    : "#1e3a5c"
                  : "grey.500",
              backgroundColor:
                attackSpeed === 50
                  ? isDark
                    ? "rgba(0, 255, 255, 0.1)"
                    : "rgba(30, 58, 92, 0.1)"
                  : "transparent",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(0, 255, 255, 0.2)"
                  : "rgba(30, 58, 92, 0.2)",
              },
            }}
          >
            <SpeedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Filtrar Regiões">
          <IconButton
            onClick={() =>
              setSelectedRegions(
                selectedRegions.includes("ALL")
                  ? ["USA", "CHINA", "RUSSIA"]
                  : ["ALL"]
              )
            }
            sx={{
              color: !selectedRegions.includes("ALL")
                ? isDark
                  ? "#00ffff"
                  : "#1e3a5c"
                : "grey.500",
              backgroundColor: !selectedRegions.includes("ALL")
                ? isDark
                  ? "rgba(0, 255, 255, 0.1)"
                  : "rgba(30, 58, 92, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(0, 255, 255, 0.2)"
                  : "rgba(30, 58, 92, 0.2)",
              },
            }}
          >
            <FilterAltIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          "& svg": {
            width: "100%",
            height: "100%",
            maxHeight: "600px",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          },
        }}
      >
        <svg ref={svgRef} />
      </Box>
    </Paper>
  );
}
