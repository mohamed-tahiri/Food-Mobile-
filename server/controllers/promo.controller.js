export const validatePromoCode = (req, res) => {
    const { code, subtotal } = req.body;

    const promoCodes = {
        "BIENVENUE30": { discount: 30, type: "percent", minOrder: 20, maxDiscount: 15 },
        "FOODIE10": { discount: 10, type: "percent", minOrder: 15, maxDiscount: 10 },
        "LIVRAISON": { discount: 100, type: "delivery", minOrder: 25 }
    };

    const promo = promoCodes[code?.toUpperCase()];

    if (!promo) {
        return res.status(400).json({ success: false, message: "Code promo invalide" });
    }

    if (subtotal < promo.minOrder) {
        return res.status(400).json({ 
        success: false, 
        message: `Commande minimum de ${promo.minOrder}€ requise pour ce code` 
        });
    }

    let discountAmount = 0;
    if (promo.type === "percent") {
        discountAmount = Math.min((subtotal * promo.discount) / 100, promo.maxDiscount || Infinity);
    } else if (promo.type === "delivery") {
        discountAmount = "free_delivery";
    }

    res.json({
        success: true,
        data: {
            code: code.toUpperCase(),
            discount: discountAmount,
            type: promo.type,
            message: promo.type === "delivery" ? "Livraison gratuite !" : `-${discountAmount.toFixed(2)}€`
        }
    });
};