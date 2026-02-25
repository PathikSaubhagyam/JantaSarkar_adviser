import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FONTS_Family } from '../../constants/Font';
import { COLORS } from '../../constants/Colors';
import { BASE_URL } from '../../constants/Utils';
import APIWebCall from '../../common/APIWebCall';
import SnackBarCommon from '../../components/SnackBarCommon';

type DocumentType = 'id_proof' | 'pancard' | 'bar_certificate';

type UploadResponse = {
  status: boolean;
  message?: string;
  documents?: {
    bar_certificate?: string;
    id_proof?: string;
    pancard?: string;
  };
};

export default function UploadDocScreen() {
  const navigation = useNavigation<any>();

  const [idProof, setIdProof] = useState<any>(null);
  const [pancard, setPancard] = useState<any>(null);
  const [barCertificate, setBarCertificate] = useState<any>(null);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUploadedDocuments();
  }, []);

  const buildImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const baseOrigin = BASE_URL.replace(/\/+$/, '');
    return `${baseOrigin}${path}`;
  };

  const fetchUploadedDocuments = async () => {
    try {
      setLoading(true);
      const response = await APIWebCall.onGetUploadedDocumentsAPICall();

      if (response?.status === true && response?.documents) {
        const docs = response.documents;

        if (docs.id_proof) {
          setIdProof({ uri: buildImageUrl(docs.id_proof), isUploaded: true });
        }
        if (docs.pancard) {
          setPancard({ uri: buildImageUrl(docs.pancard), isUploaded: true });
        }
        if (docs.bar_certificate) {
          setBarCertificate({
            uri: buildImageUrl(docs.bar_certificate),
            isUploaded: true,
          });
        }
      }
    } catch (error) {
      console.log('FETCH DOCUMENTS ERROR =>', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDocument = async (docType: DocumentType) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets?.[0]) {
      return;
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      SnackBarCommon.displayMessage({
        message: 'Please select a valid image.',
        isSuccess: false,
      });
      return;
    }

    switch (docType) {
      case 'id_proof':
        setIdProof(asset);
        SnackBarCommon.displayMessage({
          message: 'Aadhaar Card selected',
          isSuccess: true,
        });
        break;
      case 'pancard':
        setPancard(asset);
        SnackBarCommon.displayMessage({
          message: 'PAN Card selected',
          isSuccess: true,
        });
        break;
      case 'bar_certificate':
        setBarCertificate(asset);
        SnackBarCommon.displayMessage({
          message: 'Bar Certificate selected',
          isSuccess: true,
        });
        break;
    }
  };

  const handleUploadDocuments = async () => {
    // Check if at least we have new selections or need to upload
    const hasNewIdProof = idProof && !idProof.isUploaded;
    const hasNewPancard = pancard && !pancard.isUploaded;
    const hasNewBarCertificate = barCertificate && !barCertificate.isUploaded;

    if (!hasNewIdProof && !hasNewPancard && !hasNewBarCertificate) {
      SnackBarCommon.displayMessage({
        message: 'No new documents to upload',
        isSuccess: false,
      });
      return;
    }

    if (!idProof) {
      SnackBarCommon.displayMessage({
        message: 'Please select Aadhaar Card',
        isSuccess: false,
      });
      return;
    }

    if (!pancard) {
      SnackBarCommon.displayMessage({
        message: 'Please select PAN Card',
        isSuccess: false,
      });
      return;
    }

    if (!barCertificate) {
      SnackBarCommon.displayMessage({
        message: 'Please select Bar Certificate',
        isSuccess: false,
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('id_proof', {
        uri:
          Platform.OS === 'android'
            ? idProof.uri
            : idProof.uri.replace('file://', ''),
        type: idProof.type || 'image/jpeg',
        name: idProof.fileName || 'aadhar.jpg',
      } as any);

      formData.append('pancard', {
        uri:
          Platform.OS === 'android'
            ? pancard.uri
            : pancard.uri.replace('file://', ''),
        type: pancard.type || 'image/jpeg',
        name: pancard.fileName || 'pancard.jpg',
      } as any);

      formData.append('bar_certificate', {
        uri:
          Platform.OS === 'android'
            ? barCertificate.uri
            : barCertificate.uri.replace('file://', ''),
        type: barCertificate.type || 'image/jpeg',
        name: barCertificate.fileName || 'bar_certificate.jpg',
      } as any);

      const response = await APIWebCall.onUploadDocumentsAPICall(formData);

      if (response?.status === true || response?.success === true) {
        SnackBarCommon.displayMessage({
          message: response?.message || 'Documents uploaded successfully',
          isSuccess: true,
        });

        // Refresh documents after upload
        await fetchUploadedDocuments();
      } else {
        SnackBarCommon.displayMessage({
          message: response?.message || 'Upload failed. Please try again.',
          isSuccess: false,
        });
      }
    } catch (error) {
      console.log('UPLOAD ERROR =>', error);
      SnackBarCommon.displayMessage({
        message: 'Could not upload documents. Please try again.',
        isSuccess: false,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Upload Documents</Text>
        <Text style={styles.subTitle}>
          Please upload all required documents for verification.
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading documents...</Text>
          </View>
        ) : (
          <>
            {/* Aadhaar Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="badge" size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Aadhaar Card</Text>
              </View>

              {idProof ? (
                <Image
                  source={{ uri: idProof.uri }}
                  style={styles.preview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyBox}>
                  <Icon name="add-photo-alternate" size={32} color="#9ca3af" />
                  <Text style={styles.emptyText}>No image selected</Text>
                </View>
              )}

              <Pressable
                style={styles.selectBtn}
                onPress={() => handleSelectDocument('id_proof')}
              >
                <Icon name="photo-library" size={18} color={COLORS.primary} />
                <Text style={styles.selectBtnText}>
                  {idProof ? 'Change Image' : 'Select Image'}
                </Text>
              </Pressable>
            </View>

            {/* PAN Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="credit-card" size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>PAN Card</Text>
              </View>

              {pancard ? (
                <Image
                  source={{ uri: pancard.uri }}
                  style={styles.preview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyBox}>
                  <Icon name="add-photo-alternate" size={32} color="#9ca3af" />
                  <Text style={styles.emptyText}>No image selected</Text>
                </View>
              )}

              <Pressable
                style={styles.selectBtn}
                onPress={() => handleSelectDocument('pancard')}
              >
                <Icon name="photo-library" size={18} color={COLORS.primary} />
                <Text style={styles.selectBtnText}>
                  {pancard ? 'Change Image' : 'Select Image'}
                </Text>
              </Pressable>
            </View>

            {/* Bar Certificate */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="description" size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Bar Certificate</Text>
              </View>

              {barCertificate ? (
                <Image
                  source={{ uri: barCertificate.uri }}
                  style={styles.preview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyBox}>
                  <Icon name="add-photo-alternate" size={32} color="#9ca3af" />
                  <Text style={styles.emptyText}>No image selected</Text>
                </View>
              )}

              <Pressable
                style={styles.selectBtn}
                onPress={() => handleSelectDocument('bar_certificate')}
              >
                <Icon name="photo-library" size={18} color={COLORS.primary} />
                <Text style={styles.selectBtnText}>
                  {barCertificate ? 'Change Image' : 'Select Image'}
                </Text>
              </Pressable>
            </View>

            {/* Upload Button */}
            <Pressable
              style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
              onPress={handleUploadDocuments}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Icon name="cloud-upload" size={20} color="#ffffff" />
                  <Text style={styles.uploadBtnText}>Upload All Documents</Text>
                </>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    color: '#111827',
    fontFamily: FONTS_Family.FontBold,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    fontFamily: FONTS_Family.FontMedium,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: '#111827',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyBox: {
    height: 140,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9ca3af',
    fontFamily: FONTS_Family.FontMedium,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 8,
  },
  selectBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    gap: 8,
  },
  uploadBtnDisabled: {
    opacity: 0.7,
  },
  uploadBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: FONTS_Family.FontBold,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontFamily: FONTS_Family.FontMedium,
  },
});
