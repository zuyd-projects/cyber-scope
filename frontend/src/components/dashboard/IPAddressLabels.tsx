import React from "react";
import clsx from "clsx";

export interface IPAddressInfo {
  address: string;
  is_blocked?: number;
  is_local?: number;
  is_vpn?: number;
  is_datacenter?: number;
  is_tor_exit_node?: number;
  geo_location?: {
    country_code?: string;
  };
}

export interface IPAddressLabelsProps {
  sourceIP: IPAddressInfo;
  isRiskCountry?: boolean;
  occurrences?: number;
  showOccurrences?: boolean;
}

const IPAddressLabels: React.FC<IPAddressLabelsProps> = ({
  sourceIP,
  isRiskCountry,
  occurrences = 0,
  showOccurrences = false,
}) => {
  return (
    <>
      {isRiskCountry && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded">RISK</span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          IP-adres uit risicoland
        </div>
      </span>
      )}
      {sourceIP.is_blocked == 1 && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-200 rounded">BLOCKLIST</span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          IP staat op een blocklist
        </div>
      </span>
      )}
      {sourceIP.is_local == 1 && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded">LOCAL</span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          Lokaal netwerkadres
        </div>
      </span>
      )}
      {sourceIP.is_vpn == 1 && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded">VPN</span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          VPN-verbinding gedetecteerd
        </div>
      </span>
      )}
      {sourceIP.is_datacenter == 1 && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-200 rounded">DATACENTER</span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          IP van datacenter
        </div>
      </span>
      )}
      {sourceIP.is_tor_exit_node == 1 && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-200 rounded">TOR</span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          Verkeer via Tor-netwerk
        </div>
      </span>
      )}
      {showOccurrences && occurrences > 1 && (
        <span className="relative group">
        <span className="px-2 py-0.5 text-xs font-semibold text-orange-800 bg-orange-200 rounded">
          {occurrences}×
        </span>
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          Aantal keer dat dit IP voorkomt
        </div>
      </span>
      )}
    </>
  );
};

export default IPAddressLabels;
