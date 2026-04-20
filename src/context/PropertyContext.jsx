import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch Agents
      const { data: agentsData, error: agentsError } = await supabase
        .from("agents")
        .select("*");
      if (agentsError) throw agentsError;
      setAgents(agentsData);

      // Fetch Properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .order("date_added", { ascending: false });
      if (propertiesError) throw propertiesError;

      // Map property field names (snake_case to camelCase where needed)
      const mappedProperties = propertiesData.map((p) => ({
        ...p,
        dateAdded: p.date_added,
        agent: p.agent_id,
      }));

      setProperties(mappedProperties);
    } catch (err) {
      console.error("Error fetching data from Supabase:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const getPropertyById = useCallback(
    (id) => {
      const property = properties.find((p) => p.id === id);
      if (property && typeof property.agent === "string") {
        return {
          ...property,
          agent: agents.find((a) => a.id === property.agent) || property.agent,
        };
      }
      return property;
    },
    [properties, agents],
  );

  const getAgentById = useCallback(
    (id) => agents.find((a) => a.id === id),
    [agents],
  );
  const getFeaturedProperties = useCallback(
    () => properties.filter((p) => p.featured),
    [properties],
  );
  const getPropertiesByCity = useCallback(
    (city) =>
      properties.filter(
        (p) => p.location.city.toLowerCase() === city.toLowerCase(),
      ),
    [properties],
  );

  return (
    <PropertyContext.Provider
      value={{
        properties,
        agents,
        loading,
        fetchInitialData,
        getPropertyById,
        getAgentById,
        getFeaturedProperties,
        getPropertiesByCity,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
};
