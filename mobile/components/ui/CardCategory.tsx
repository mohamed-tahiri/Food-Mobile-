import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Cat {
 id: string;
 icon: string;
 name: string;
}

interface CardCategoryProps {
    cat: Cat;
}

export default function CardCategory({ cat }: CardCategoryProps){
    return (
        <TouchableOpacity key={cat.id} style={styles.catItem}>
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={styles.catName}>{cat.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  promoContainer: { marginTop: 25, flexDirection: 'row' },
  container: { flex: 1, backgroundColor: '#FDFDFD', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 },
  deliveryTo: { color: '#999', fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  address: { fontWeight: 'bold', fontSize: 16 },
  profilePic: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#FF6B35' },
  searchSection: { marginTop: 25 },
  searchBar: { flexDirection: 'row', backgroundColor: '#F1F1F1', padding: 12, borderRadius: 15, alignItems: 'center' },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
  catList: { flexDirection: 'row' },
  catItem: { alignItems: 'center', marginRight: 25 },
  catIcon: { fontSize: 30, backgroundColor: '#FFF', padding: 10, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  catName: { marginTop: 8, fontWeight: '500', color: '#444' },
});