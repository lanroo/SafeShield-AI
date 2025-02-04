import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";
import { threatService, Threat } from "../../services/threatService";

const getRiskColor = (
  risk: string
): "error" | "warning" | "success" | "default" => {
  switch (risk) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "default";
  }
};

export default function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThreats = async () => {
      try {
        const data = await threatService.getThreats();
        setThreats(data);
      } catch (error) {
        console.error("Erro ao carregar ameaças:", error);
      } finally {
        setLoading(false);
      }
    };

    loadThreats();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ameaças Detectadas
      </Typography>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IP</TableCell>
                <TableCell>País</TableCell>
                <TableCell>Data/Hora</TableCell>
                <TableCell>Nível de Risco</TableCell>
                <TableCell>Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {threats.map((threat) => (
                <TableRow key={threat.id}>
                  <TableCell>{threat.ip_address}</TableCell>
                  <TableCell>{threat.country}</TableCell>
                  <TableCell>
                    {new Date(threat.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={threat.risk_level.toUpperCase()}
                      color={getRiskColor(threat.risk_level)}
                    />
                  </TableCell>
                  <TableCell>{threat.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
