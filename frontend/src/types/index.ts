export type FirewallLog = {
  id: number;
  device_id: number;
  action: string;
  captured_at: string;
  source_ip: IPAddress;
  source_port: number;
  destination_port: number;
};

type IPAddress = {
  id: number;
  address: string;
  is_local: number;
  is_tor_exit_node: number;
  is_vpn: number;
  is_datacenter: number;
  is_blocked: number;
  geo_location: GeoLocation;
};

type GeoLocation = {
  country_name: string;
  country_code: string;
};

export interface Device {
  id: number;
  name: string;
  key: string;
  os: string;
  status: number;
}

export type SSHLog = {
  id: number;
  device_id: number;
  source_ip: IPAddress;
  process_name: string;
  captured_at: string;
};

export type CountryConnections = {
  inbound: CountryConnection[];
  outbound: CountryConnection[];
};

export type CountryConnection = {
  country_name: string;
  country_code: string;
  total_connections: number;
};

export interface AggregatedData {
  firewalllogs?: Record<string, number>;
  sshlogs?: Record<string, number>;
  packets?: Record<string, number>;
}
