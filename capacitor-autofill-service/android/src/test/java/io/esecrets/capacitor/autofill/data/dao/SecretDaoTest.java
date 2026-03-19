package io.esecrets.capacitor.autofill.data.dao;

import com.getcapacitor.JSObject;

import org.junit.Test;

import java.util.List;
import java.util.Optional;

import io.esecrets.capacitor.autofill.data.security.Vault;

import static java.util.Optional.empty;
import static java.util.Optional.of;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SecretDaoTest {

  static class NullKvDao implements KeyValueDao {
    @Override
    public Optional<String> get(String key) {
      return empty();
    }

    @Override
    public void set(String key, String val) {
    }

    @Override
    public void deleteKey(String key) {

    }
  }

  static class InvalidKvDao implements KeyValueDao {
    @Override
    public Optional<String> get(String key) {
      return of("invalid");
    }

    @Override
    public void set(String key, String val) {
    }

    @Override
    public void deleteKey(String key) {

    }
  }

  @Test
  public void shouldGetTheSecrets() {
    MockKvDao kvDao = new MockKvDao();
    Vault vault = new Vault(new VaultDao(kvDao));
    vault.unseal("123");
    SecretDao dao = new SecretDao(kvDao, vault);

    List<JSObject> secrets = dao.getAll();

    assertNotNull(secrets);
    assertEquals(3, secrets.size());
  }

  @Test
  public void whenTheSecretsAreEmptyReturnAnEmptyJSONArray() {
    MockKvDao kvDao = new MockKvDao();
    Vault vault = new Vault(new VaultDao(kvDao));
    vault.unseal("123");
    SecretDao dao = new SecretDao(new NullKvDao(), vault);

    List<JSObject> secrets = dao.getAll();

    assertNotNull(secrets);
    assertEquals(0, secrets.size());
  }

  @Test(expected = SecretDao.SecretsDeserializationException.class)
  public void whenTheSecretsAreInvalid() {
    MockKvDao kvDao = new MockKvDao();
    Vault vault = new Vault(new VaultDao(kvDao));
    vault.unseal("123");
    SecretDao dao = new SecretDao(new InvalidKvDao(), vault);

    dao.getAll();
  }
}