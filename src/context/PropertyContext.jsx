import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import propertiesData from "../data/properties.json";
import blogData from "../data/blog.json";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState(propertiesData);
  const [blogs] = useState(blogData);

  useEffect(() => {
    setProperties(propertiesData);
  }, [propertiesData]);

  const getPropertyById = useCallback(
    (id) => properties.find((p) => p.id === id),
    [properties],
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
        blogs,
        getPropertyById,
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
