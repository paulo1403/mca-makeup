"use client";

import { motion } from "framer-motion";
import { MapPin, Search, TrendingUp, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import Typography from "./ui/Typography";

interface TransportCost {
    district: string;
    cost: number;
    notes?: string;
}

export default function TransportCostCalculator() {
    const [transportCosts, setTransportCosts] = useState<TransportCost[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<TransportCost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransportCosts = async () => {
            try {
                const response = await fetch("/api/transport-costs");
                const data = await response.json();
                setTransportCosts(data);
            } catch (error) {
                console.error("Error fetching transport costs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransportCosts();
    }, []);

    const filteredDistricts = transportCosts.filter((tc) =>
        tc.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDistrictSelect = (district: TransportCost) => {
        setSelectedDistrict(district);
        setSearchTerm(district.district);
    };

    return (
        <div className="transport-calculator">
            <motion.div
                className="transport-calculator-header"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="transport-calculator-icon">
                    <Truck className="w-6 h-6" />
                </div>
                <Typography as="h3" variant="h3" className="transport-calculator-title">
                    Calculadora de Transporte
                </Typography>
                <Typography as="p" variant="p" className="transport-calculator-description">
                    Consulta el costo de transporte a tu distrito antes de agendar tu cita
                </Typography>
            </motion.div>

            <motion.div
                className="transport-calculator-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {/* Search Input */}
                <div className="transport-search-wrapper">
                    <Search className="transport-search-icon" />
                    <input
                        type="text"
                        placeholder="Busca tu distrito..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedDistrict(null);
                        }}
                        className="transport-search-input"
                    />
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="transport-loading">
                        <div className="transport-spinner" />
                        <p>Cargando distritos...</p>
                    </div>
                ) : (
                    <>
                        {/* Selected District Display */}
                        {selectedDistrict && (
                            <motion.div
                                className="transport-result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="transport-result-header">
                                    <MapPin className="w-5 h-5 text-[color:var(--primary)]" />
                                    <Typography as="h4" variant="h4" className="transport-result-district">
                                        {selectedDistrict.district}
                                    </Typography>
                                </div>
                                <div className="transport-result-cost">
                                    <span className="transport-result-label">Costo de transporte:</span>
                                    <span className="transport-result-amount">
                                        {selectedDistrict.cost === 0 ? (
                                            <span className="transport-result-free">Gratis</span>
                                        ) : (
                                            `S/ ${selectedDistrict.cost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {selectedDistrict.notes && (
                                    <div className="transport-result-note">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{selectedDistrict.notes}</span>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* District List */}
                        {searchTerm && !selectedDistrict && (
                            <div className="transport-list">
                                {filteredDistricts.length > 0 ? (
                                    <div className="transport-list-items">
                                        {filteredDistricts.slice(0, 8).map((district, index) => (
                                            <motion.button
                                                key={district.district}
                                                type="button"
                                                className="transport-list-item"
                                                onClick={() => handleDistrictSelect(district)}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                whileHover={{ x: 4 }}
                                            >
                                                <MapPin className="w-4 h-4 text-[color:var(--primary)]" />
                                                <span className="transport-list-item-name">{district.district}</span>
                                                <span className="transport-list-item-cost">
                                                    {district.cost === 0 ? "Gratis" : `S/ ${district.cost.toFixed(2)}`}
                                                </span>
                                            </motion.button>
                                        ))}
                                        {filteredDistricts.length > 8 && (
                                            <p className="transport-list-more">
                                                +{filteredDistricts.length - 8} distritos más...
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="transport-no-results">
                                        <MapPin className="w-8 h-8 opacity-30" />
                                        <p>No se encontraron distritos</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Info Card */}
                        {!searchTerm && (
                            <div className="transport-info">
                                <div className="transport-info-item">
                                    <div className="transport-info-icon">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="transport-info-content">
                                        <h5 className="transport-info-title">Servicio a Domicilio</h5>
                                        <p className="transport-info-text">
                                            Llevo mi servicio profesional a la comodidad de tu hogar
                                        </p>
                                    </div>
                                </div>
                                <div className="transport-info-item">
                                    <div className="transport-info-icon">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div className="transport-info-content">
                                        <h5 className="transport-info-title">Costos Transparentes</h5>
                                        <p className="transport-info-text">
                                            Conoce el costo exacto antes de agendar tu cita
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
