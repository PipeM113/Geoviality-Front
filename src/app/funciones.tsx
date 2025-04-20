// parse
export const parseType = (typeString: string): string[] => {
    try {
      const parsedType = JSON.parse(typeString);
      return Array.isArray(parsedType) ? parsedType : [];
    } catch (error) {
      console.error('Error parsing type as JSON:', error);
      return [];
    }
  };
