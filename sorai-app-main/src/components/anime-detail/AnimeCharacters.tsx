import { Users } from "lucide-react";
import type { JikanCharacter } from "@/types/jikan";

interface AnimeCharactersProps {
    characters: JikanCharacter[];
}

export default function AnimeCharacters({ characters }: AnimeCharactersProps) {
    if (characters.length === 0) return null;

    return (
        <section>
            <h2 className="text-text-primary mb-4 flex items-center gap-2 text-[1.5rem] font-semibold">
                <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                <Users size={16} className="text-text-secondary" />
                Characters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characters.map((char: JikanCharacter, i: number) => {
                    const japaneseVA = char.voice_actors?.find(
                        (va) => va.language === "Japanese"
                    );
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-surface rounded-2xl"
                            style={{ boxShadow: "var(--shadow-info-card)" }}
                        >
                            <img
                                src={char.character?.images?.jpg?.image_url}
                                alt={char.character?.name}
                                className="w-14 h-14 rounded-xl object-cover shrink-0"
                                loading="lazy"
                            />
                            <div className="min-w-0">
                                <p className="text-text-primary text-sm truncate font-medium">
                                    {char.character?.name}
                                </p>
                                <p className="text-gray-400 text-xs">{char.role}</p>
                                {japaneseVA && (
                                    <p className="text-text-secondary text-xs truncate">
                                        {japaneseVA.person?.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
