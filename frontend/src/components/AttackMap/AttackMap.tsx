import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import * as d3 from "d3";
import { feature } from "topojson-client";
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<WorldTopology | null>(null);

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
      .style("background-color", "transparent");

    // Grupo principal para aplicar transformações
    const g = svg.append("g");

    // Adiciona o mapa base
    const world = feature(
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
      const sourcePos = projection(attack.source)!;
      const targetPos = projection(attack.target)!;

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

      const source = attacks[Math.floor(Math.random() * attacks.length)];
      const target = attacks[Math.floor(Math.random() * attacks.length)];

      if (source !== target) {
        addAttack({
          source,
          target,
          type: "attack",
        });
      }
    };

    // Inicia a simulação
    const interval = setInterval(generateRandomAttack, 1000);

    return () => clearInterval(interval);
  }, [worldData]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "#00ffff", mb: 2 }}>
        Mapa de Ataques em Tempo Real
      </Typography>
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
