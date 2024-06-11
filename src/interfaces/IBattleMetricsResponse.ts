export interface IBattleMetricsResponse {
  data: {
    attributes: {
      name: string;
      players: number;
      maxPlayers: number;
      status: string;
      details: {
        rust_last_wipe: string;
      };
    };
  };
}
