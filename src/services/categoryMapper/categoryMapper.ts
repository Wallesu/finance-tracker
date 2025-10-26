export function categoryMapper(description: string): string {
    const patterns: Record<string, string[]> = {
        bebida: ["bebida", "cervejaria"],
        animais: ["nutri norte"],
        alimentação: [
            "ifood",
            "bodega do ju",
            "JANAINA CUN",
            "Mercado GUTO",
            "SORVETERIA"
        ],
        entretenimento: ["cinema", "ALLES PARK", "Rufino"],
        roupa: ["youcom"],
        "cosméticos/aparência": ["ronaldodanielsala"],
        tech: ["kabum"],
        educação: ["instituto de educacao"],
        transporte: ["uber"],
        outros: [
            "cia aguas de joinville",
            "tim s a",
            "Seguro de Vida - SEGURO DE VIDA"
        ]
    }

    const lowerDesc = description.toLowerCase()

    for (const [category, keywords] of Object.entries(patterns)) {
        if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
            return category
        }
    }

    return ""
}
