import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const generateAccountNumber = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash).toString().slice(0, 9); // Return a 9-digit positive number
};

const InfoSuperATM = () => {
  const [screen, setScreen] = useState("login");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const handleLogin = () => {
    if (!accountHolder.trim()) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    if (!balance || isNaN(parseFloat(balance)) || parseFloat(balance) <= 0) {
      Alert.alert("Error", "Please enter your initial balance.");
      return;
    }

    setAccountNumber(generateAccountNumber(accountHolder)); // Generate account number
    setBalance(parseFloat(balance)); // Store balance as a number
    setScreen("dashboard"); // Navigate to dashboard
  };

  const handleLogout = () => {
    // Reset all states
    setAccountHolder("");
    setAccountNumber("");
    setBalance("");
    setAmount("");
    setScreen("login"); // Navigate back to login screen
  };

  const handleWithdrawPress = () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    if (parsedAmount > balance) {
      Alert.alert("Error", "Insufficient balance.");
      return;
    }

    setWithdrawAmount(parsedAmount);
    setModalVisible(true);
  };

  const confirmWithdraw = () => {
    setBalance((prevBalance) => prevBalance - withdrawAmount); // Update balance
    setModalVisible(false);
    setAmount(""); // Reset input
    Alert.alert("Success", `${withdrawAmount} withdrawn successfully.`);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        {screen === "login" ? (
          <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
            {/* Top Section */}
            <View style={styles.topSection}>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }} // Placeholder logo URL
                style={styles.logo}
              />
              <Text style={styles.bankName}>InfoSuper Bank</Text>
            </View>

            {/* Login Form */}
            <Text style={styles.header}>Login to Your Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={accountHolder}
              onChangeText={(text) => setAccountHolder(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your initial balance"
              keyboardType="numeric"
              value={balance}
              onChangeText={(text) => setBalance(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Bottom Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Your trusted partner in banking.</Text>
            </View>
          </LinearGradient>
        ) : (
          <LinearGradient colors={["#232526", "#414345"]} style={styles.container}>
            {/* Top Section */}
            <View style={styles.topSection}>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }} // Placeholder logo URL
                style={styles.logo}
              />
              <Text style={styles.bankName}>InfoSuper Bank</Text>
            </View>

            {/* Dashboard */}
            <Text style={styles.header}>InfoSuper Bank - Cash Withdrawal</Text>
            <View style={styles.accountCard}>
              <Text style={styles.cardText}>Account Holder: {accountHolder}</Text>
              <Text style={styles.cardText}>Account Number: {accountNumber}</Text>
              <Text style={styles.cardText}>Balance: ${balance.toFixed(2)}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter amount to withdraw"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleWithdrawPress}>
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ff4757" }]}
              onPress={handleLogout} // Reset all states and log out
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            {/* Bottom Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Thank you for banking with InfoSuper Bank.</Text>
            </View>

            {/* Confirmation Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Are you sure you want to withdraw ${withdrawAmount.toFixed(2)}?
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton]}
                      onPress={confirmWithdraw}
                    >
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </LinearGradient>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  bankName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  accountCard: {
    backgroundColor: "#1c1c1c",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    width: "90%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    flex: 1,
    marginLeft: 5,
  },
});

export default InfoSuperATM;
