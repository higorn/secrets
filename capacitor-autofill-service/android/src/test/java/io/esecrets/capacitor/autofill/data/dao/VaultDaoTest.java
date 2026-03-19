package io.esecrets.capacitor.autofill.data.dao;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class VaultDaoTest {

  @Test
  public void shouldGetTheVaultContent() {
    MockKvDao kvDao = new MockKvDao();
    VaultDao vaultDao = new VaultDao(kvDao);
    List<String> vault = vaultDao.getAll();
    assertNotNull(vault);
    assertEquals(3, vault.size());
  }
}