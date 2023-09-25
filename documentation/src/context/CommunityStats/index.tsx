import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface ICommunityStatsContext {
    githubStarCount: number;
    githubStarCountText: string;
    githubCommitCount: number;
    discordMemberCount: number;
    loading: boolean;
    refetch: () => Promise<void>;
}

export const CommunityStatsContext = createContext<
    ICommunityStatsContext | undefined
>(undefined);

export const CommunityStatsProvider: FC = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [githubStarCount, setGithubStarCount] = useState(0);
    const [githubCommitCount, setGithubCommitCount] = useState(0);
    const [discordMemberCount, setDiscordMemberCount] = useState(0);

    const fetchGithubCount = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `https://stargate.refine.dev/community-numbers`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const json = await response.json();
            setGithubStarCount(json.githubStarCount);
            setGithubCommitCount(json.githubCommitCount);
            setDiscordMemberCount(json.discordMemberCount);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGithubCount();
    }, [fetchGithubCount]);

    const githubStarCountText = useMemo(() => {
        const hasIntlSupport =
            typeof Intl == "object" &&
            Intl &&
            typeof Intl.NumberFormat == "function";

        if (!hasIntlSupport) {
            return `${(githubStarCount / 1000).toFixed(1)}k`;
        }

        const formatter = new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
            maximumSignificantDigits: 3,
        });
        return formatter.format(githubStarCount);
    }, [githubStarCount]);

    const value = {
        githubStarCount,
        githubStarCountText,
        githubCommitCount,
        discordMemberCount,
        loading,
        refetch: fetchGithubCount,
    };

    return (
        <CommunityStatsContext.Provider value={value}>
            {children}
        </CommunityStatsContext.Provider>
    );
};

export const useCommunityStatsContext = () => {
    const context = useContext(CommunityStatsContext);
    if (context === undefined) {
        throw new Error(
            "useGithubProvider must be used within a GithubProvider",
        );
    }
    return context;
};
