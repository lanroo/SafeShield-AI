import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";

interface Event {
  id: number;
  description: string;
  timestamp: string;
  ip_address: string;
  country: string;
  threat_score: number;
  alert_level: string;
  network_zone?: string;
  asset_name?: string;
}

interface EventListProps {
  events: Event[];
  loading: boolean;
  view: string;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  loading,
  view,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!events.length) {
    return (
      <Box p={4}>
        <Typography>Nenhum evento encontrado.</Typography>
      </Box>
    );
  }

  return (
    <List>
      {events.map((event) => (
        <ListItem
          key={event.id}
          component={Paper}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: event.threat_score > 0.7 ? "#fff4f4" : "#f5f5f5",
            ...(view === "compact" && { p: 1, mb: 1 }),
          }}
        >
          <ListItemText
            primary={
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {event.description}
              </Typography>
            }
            secondary={
              <>
                <Typography variant="body2" color="text.secondary">
                  🌍 {event.country} | 🖥️ {event.ip_address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ⚠️ Nível de Ameaça: {(event.threat_score * 100).toFixed(1)}% |
                  🏷️ {event.alert_level}
                </Typography>
                {event.network_zone && (
                  <Typography variant="body2" color="text.secondary">
                    🔒 Zona: {event.network_zone}
                  </Typography>
                )}
                {event.asset_name && (
                  <Typography variant="body2" color="text.secondary">
                    💻 Ativo: {event.asset_name}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  🕒 {new Date(event.timestamp).toLocaleString()}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
