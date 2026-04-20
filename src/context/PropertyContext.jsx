import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./ToastContext";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
      showToast("Failed to load property data. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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

  const addProperty = useCallback(
    async (property) => {
      try {
        const { error } = await supabase.from("properties").insert([property]);
        if (error) throw error;
        await fetchInitialData();
      } catch (err) {
        console.error("Error adding property:", err.message);
        throw err;
      }
    },
    [fetchInitialData],
  );

  const updateProperty = useCallback(
    async (id, property) => {
      try {
        const { error } = await supabase
          .from("properties")
          .update(property)
          .eq("id", id);
        if (error) throw error;
        await fetchInitialData();
      } catch (err) {
        console.error("Error updating property:", err.message);
        throw err;
      }
    },
    [fetchInitialData],
  );

  const deleteProperty = useCallback(
    async (id) => {
      try {
        const { error } = await supabase
          .from("properties")
          .delete()
          .eq("id", id);
        if (error) throw error;
        await fetchInitialData();
      } catch (err) {
        console.error("Error deleting property:", err.message);
        throw err;
      }
    },
    [fetchInitialData],
  );

  const addAgent = useCallback(
    async (agent) => {
      try {
        const { error } = await supabase.from("agents").insert([agent]);
        if (error) throw error;
        await fetchInitialData();
      } catch (err) {
        console.error("Error adding agent:", err.message);
        throw err;
      }
    },
    [fetchInitialData],
  );

  const updateAgent = useCallback(
    async (id, agent) => {
      try {
        const { error } = await supabase
          .from("agents")
          .update(agent)
          .eq("id", id);
        if (error) throw error;
        await fetchInitialData();
      } catch (err) {
        console.error("Error updating agent:", err.message);
        throw err;
      }
    },
    [fetchInitialData],
  );

  const deleteAgent = useCallback(
    async (id) => {
      try {
        const { error } = await supabase.from("agents").delete().eq("id", id);
        if (error) throw error;
        await fetchInitialData();
      } catch (err) {
        console.error("Error deleting agent:", err.message);
        throw err;
      }
    },
    [fetchInitialData],
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
        addProperty,
        updateProperty,
        deleteProperty,
        addAgent,
        updateAgent,
        deleteAgent,
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
