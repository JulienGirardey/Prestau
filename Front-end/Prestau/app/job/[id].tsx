import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions, Alert, Modal, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getJobById } from "@/src/api/job";
import { createJobOffer, deleteJobOffer, acceptJobOffer, rejectJobOffer, cancelJobOffer } from "@/src/api/joboffer"; // Import de la fonction de suppression
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

// Hook pour la gestion du design adaptatif
function useResponsive() {
  const { width } = useWindowDimensions();
  const scale = (size: number) => (width / 390) * size;
  const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
  return {
    width,
    scale,
    scaleFont,
  };
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const { scale, scaleFont } = useResponsive();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showApplicants, setShowApplicants] = useState(false);

  // Récupération des détails du job
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(Number(id)),
    enabled: id != null,
  });

  // Mutation pour postuler à l'offre
  const { mutate: applyToJob, isPending: isApplying } = useMutation({
    mutationFn: () => createJobOffer(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
      router.push("/(tabs-worker)/dashboard-worker");
    },
    onError: (err: any) => {
      console.error("Erreur lors de la candidature :", err);
      Alert.alert("Erreur", "Impossible de postuler à cette offre.");
    },
  });

  // Mutation pour annuler la candidature
  const { mutate: cancelApply, isPending: isCancelling } = useMutation({
    mutationFn: () => deleteJobOffer(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
      router.push("/(tabs-worker)/dashboard-worker");
    },
    onError: (err: any) => {
      console.error("Erreur lors de l'annulation :", err);
      Alert.alert("Erreur", "Impossible d'annuler la candidature.");
    },
  });
	// Mutation pour accepter le candidat
  const { mutate: acceptMutation, isPending: isAccepting } = useMutation({
    mutationFn: (offerId: number) => acceptJobOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
      Alert.alert("Succès", "Le candidat a été accepté.");
    },
    onError: () => Alert.alert("Erreur", "Impossible d'accepter ce candidat.")
  });

  
	// Mutation pour anuler la candidature du candidat (refuser après acceptation)
  const { mutate: rejectMutation, isPending: isRejecting } = useMutation({
    mutationFn: (offerId: number) => rejectJobOffer(offerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["job", id] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
      Alert.alert("Succès", "Le candidat a été annule.");
    },
    onError: () => Alert.alert("Erreur", "Impossible de annuler ce candidat.")
  });

	// Mutation pour refuser le candidat
	const { mutate: cancelMutation, isPending: isCancellingCandidate } = useMutation({
		mutationFn: (offerId: number) => cancelJobOffer(offerId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job", id] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
			Alert.alert("Succès", "La candidature a été refuse.");
		},
		onError: () => Alert.alert("Erreur", "Impossible de refuse cette candidature.")
	});

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.primary }}>Mission non trouvée</Text>
      </View>
    );
  }


	const myOffer = job.jobOffers?.find((offer: any) => offer.status === 'REJECTED' || offer.status === 'CANCELLED' || job.alreadyApplied);

	const isRejected = myOffer?.status === 'REJECTED' || myOffer?.status === 'CANCELLED';
	// Filtrer les offres d'emploi pour n'afficher que celles qui sont en cours ou acceptées
	const activeOffers = Array.isArray(job?.jobOffers) 
    ? job.jobOffers.filter((offer: any) => offer.status === 'PENDING' || offer.status === 'ACCEPTED')
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <ScrollView style={styles.main}>
        <View style={[styles.jobCard, { backgroundColor: "white", margin: scale(25) }]}>
          {/* Header de la carte */}
          <View style={styles.jobHeader}>
            <Text style={[styles.jobTitle, { fontSize: scaleFont(20) }]}>{job.title}</Text>
            <View style={styles.salaryBadge}>
              <Text style={[styles.salaryText, { fontSize: scaleFont(15) }]}>{job.salary}€</Text>
            </View>
          </View>

          {/* Adresse */}
          <View style={styles.addressRow}>
            <Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Adresse:</Text>
          </View>
          <Text style={[styles.addressText, { fontSize: scaleFont(13), marginLeft: scale(10) }]} numberOfLines={2} ellipsizeMode="tail">
            {job.company?.address}, {job.company?.city} ({job.company?.postalCode})
          </Text>

          {/* Description */}
          <Text style={[styles.addressTitle, { fontSize: scaleFont(14), marginTop: scale(10) }]}>Description:</Text>
          <Text style={[styles.jobDescription, { fontSize: scaleFont(13), marginLeft: scale(10) }]} numberOfLines={2} ellipsizeMode="tail">
            {job.description}
          </Text>

          {/* Séparateur */}
          <View style={styles.separator} />

          {/* Dates et Horaires */}
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
              <Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>{new Date(job.start_time).toLocaleDateString("fr-FR")}</Text>
              <Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>{new Date(job.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</Text>
            </View>
            <View style={styles.dateSeparator} />
            <View style={styles.dateItem}>
              <Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
              <Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>{new Date(job.end_time).toLocaleDateString("fr-FR")}</Text>
              <Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>{new Date(job.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <Text style={[styles.Status, { fontSize: scaleFont(12), color: job.status === "OPEN" ? "#27ae60" : "#e67e22" }]}>● {job.status}</Text>
        </View>

        {/* Section des boutons d'action */}
        <View style={styles.buttonContainer}>
          {job.isWorker &&  (
            <>
              {job.alreadyApplied && !isRejected ? (
                <View>
                  <View style={styles.alreadyAppliedBadge}>
                    <Text style={styles.alreadyAppliedText}>Vous avez déjà postulé pour cette offre</Text>
                  </View>
                  {/* Bouton pour ANNULER la candidature */}
                  <View style={{ marginTop: 15 }}>
                    <NewButton title={isCancelling ? "Annulation..." : "Annuler ma candidature"} onPress={() => cancelApply()} disabled={isCancelling} style={{ backgroundColor: "#FF3B30" }} />
                  </View>
                </View>
              ) : isRejected ? (
								<View style={styles.alreadyAppliedBadge}>
									<Text style={[styles.alreadyAppliedText, { color: '#FF3B30' }]}>
										Votre candidature a été refusée
									</Text>
								</View>
							) : (
                job.canApply && <NewButton title={isApplying ? "En cours..." : "Postuler"} onPress={() => applyToJob()} disabled={isApplying} />
              )}
            </>
          )}

          {/* SECTION COMPANY */}
          {!job.isWorker && (
            <>
              {Array.isArray(job.jobOffers) && job.jobOffers.length > 0 ? (
                <NewButton title={`Voir les candidats (${activeOffers.length})`} onPress={() => setShowApplicants(true)} />
              ) : (
                <View style={styles.alreadyAppliedBadge}>
                  <Text style={styles.alreadyAppliedText}>Aucune candidature pour le moment</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
      {/* Modal pour afficher les candidats */}
      <Modal visible={showApplicants} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowApplicants(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontSize: scaleFont(20) }]}>Candidats ({activeOffers?.length || 0})</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: scale(20) }}>
            {Array.isArray(activeOffers) && activeOffers.length > 0 ? (
              activeOffers.map((offer) => (
                <View key={offer.id} style={styles.applicantCard}>
                  <View style={styles.profileHeader}>
										{/*  TODO: a affishe la photo */ }
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {offer.worker?.firstName[0] || ""}
                        {offer.worker?.lastName[0] || ""}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.applicantName}>
                        {offer.worker?.firstName} {offer.worker?.lastName}
                      </Text>
                      <Text style={styles.applicantDate}>Postulé le {new Date(offer.createdAt).toLocaleDateString("fr-FR")}</Text>
                    </View>
                  </View>

                  <View style={styles.infoDivider} />

                  <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={colors.primary} />
                      <Text style={styles.infoText}>{offer.worker?.city || "Ville non spécifiée"}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={16} color={colors.primary} />
                      <Text style={styles.infoText}>{offer.worker?.phoneNumber || "Pas de téléphone"}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
                      <Text style={styles.infoText}>{offer.worker?.profession || "Profession non dispo"}</Text>
                    </View>
                  </View>

                  <View style={styles.decisionRow}>
										{offer.status === "ACCEPTED" ? (
											<TouchableOpacity 
												style={[styles.actionButton, { backgroundColor: "#FF3B30", flex: 1 }]} 
												onPress={() => rejectMutation(offer.id)}
												disabled={isRejecting}
											>
												<Text style={styles.actionButtonText}>
													{isRejecting ? "En cours..." : "Annuler la candidature"}
												</Text>
											</TouchableOpacity>
										) : (
											<>
												<TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF3B30" }]} onPress={() => cancelMutation(offer.id)} disabled={isCancellingCandidate}>
													<Text style={styles.actionButtonText}>{isCancellingCandidate ? "En cours..." : "Refuser"}</Text>
												</TouchableOpacity>

												<TouchableOpacity style={[styles.actionButton, { backgroundColor: "#27ae60" }]} onPress={() => acceptMutation(offer.id)} disabled={isAccepting}>
													<Text style={styles.actionButtonText}>{isAccepting ? "En cours..." : "Accepter"}</Text>
												</TouchableOpacity>
											</>
										)}
                  </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: "center", marginTop: scale(50) }}>
                <Text style={{ color: "#888", fontSize: scaleFont(16) }}>Aucun candidat pour cette offre.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jobTitle: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
    color: "#264D84",
  },
  salaryBadge: {
    backgroundColor: "#4a90d9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  salaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  jobDescription: {
    color: "#777",
    lineHeight: 20,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  addressTitle: {
    marginRight: 6,
    fontWeight: "600",
  },
  addressText: {
    color: "#777",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    color: "#999",
    fontWeight: "500",
    marginBottom: 2,
  },
  dateValue: {
    color: "#333",
    fontWeight: "600",
  },
  timeText: {
    color: "#777",
  },
  Status: {
    fontSize: 12,
    fontWeight: "600",
    alignSelf: "center",
  },
  dateSeparator: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: "6.5%",
    paddingBottom: 30,
  },
  alreadyAppliedBadge: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  alreadyAppliedText: {
    color: "#777",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  applicantCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  applicantName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#264D84",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontWeight: "bold",
    color: "#264D84",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4a90d9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  applicantDate: {
    fontSize: 12,
    color: "#999",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
  },
  infoGrid: {
    gap: 8,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    color: "#555",
    fontSize: 14,
  },
  decisionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
