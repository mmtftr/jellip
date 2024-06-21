import { useQuery, UseQueryResult } from "@tanstack/react-query";
import React, { useContext } from "react";

interface FuriganaArgs {
  sentence: string;
  enabled: boolean;
}
export type FuriganaPart = {
  text: string;
  furi?: string;
};

export interface FuriganaSentence {
  parts: FuriganaPart[];
}

type FuriganaHookReturn = UseQueryResult<FuriganaSentence, Error>;

export interface FuriganaService {
  getFurigana(sentence: string): Promise<FuriganaSentence>;
}

export const FuriganaContext = React.createContext({
  service: undefined as FuriganaService | undefined,
});

export const useFurigana = ({
  sentence,
  enabled,
}: FuriganaArgs): FuriganaHookReturn => {
  const { service } = useContext(FuriganaContext);

  const result = useQuery({
    queryKey: ["furigana", sentence, !!service],
    queryFn: () => {
      if (!service)
        return Promise.reject(Error("Furigana service not available"));

      return service.getFurigana(sentence);
    },
    enabled,
  });

  return result;
};
