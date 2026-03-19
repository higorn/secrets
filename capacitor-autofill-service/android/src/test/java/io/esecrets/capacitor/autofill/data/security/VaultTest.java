package io.esecrets.capacitor.autofill.data.security;

import org.junit.Before;
import org.junit.Test;

import java.lang.reflect.Field;
import java.util.Base64;

import io.esecrets.capacitor.autofill.data.dao.MockKvDao;
import io.esecrets.capacitor.autofill.data.dao.VaultDao;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class VaultTest {
  private Vault vault;

  @Before
  public void setUp() {
    vault = new Vault(new VaultDao(new MockKvDao()));
  }

  @Test
  public void shouldUnseanTheVault() throws NoSuchFieldException, IllegalAccessException {
    vault.unseal("123");
    assertField("key1");
    assertField("key2");
    assertField("key3");
  }

  @Test(expected = Vault.VaultUnsealException.class)
  public void whenUnsealWithWrongPassword_thenThrowException() {
    vault.unseal("321");
  }

  @Test
  public void shouldEncryptAndDecryptBasedOnAPassword() {
    String data = "abc";

    vault.unseal("123");
    String encoded = vault.encode(data);
    String decoded = vault.decode(encoded.getBytes());

    assertEquals(data, decoded);
  }

  @Test
  public void shouldEncryptAndDecryptWithSpecialChar() {
    String data = "ąłbc";

    vault.unseal("123");
    String encoded = vault.encode(data);
    String decoded = vault.decode(encoded.getBytes());

    assertEquals(data, decoded);
  }

  private void assertField(String fieldName) throws NoSuchFieldException, IllegalAccessException {
    Field keysManagerField = vault.getClass().getDeclaredField("keysManager");
    keysManagerField.setAccessible(true);
    VaultKeysManager keysManager = (VaultKeysManager) keysManagerField.get(vault);
    assertNotNull(keysManager);

    Field field = keysManager.getClass().getDeclaredField(fieldName);
    field.setAccessible(true);
    assertNotNull(field.get(keysManager));
  }
}