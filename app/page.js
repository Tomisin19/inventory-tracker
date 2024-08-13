"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Stack,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    if (typeof window !== "undefined") {
      const snapshot = query(collection(firestore, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      setFilteredInventory(
        inventory.filter((item) => item.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredInventory(inventory);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      bgcolor="#BBC7CE"
      padding={2}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Inventory Keeper
      </Typography>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          padding={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2}>
        <TextField
          variant="outlined"
          width="500px"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearch}
          bgcolor="white"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ fontSize: "1.2rem", padding: "10px 20px" }}
        >
          Add New Item
        </Button>
      </Stack>

      <Box
        width="100%"
        maxWidth="900px"
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={3}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
        sx={{ overflowY: "auto", marginTop: 2 }}
      >
        <Typography variant="h3" color="#333" marginBottom={4}>
          Inventory Items
        </Typography>

        <Stack width="100%" spacing={3}>
          {filteredInventory.map(({ name, quantity }) => (
            <Card
              key={name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 3,
                bgcolor: "#C4B7CB",
                color: "white",
              }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography variant="h5" component="div">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="white">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
